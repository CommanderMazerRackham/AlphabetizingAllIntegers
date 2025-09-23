class NumberViewer {
    constructor() {
        this.currentWordedNumber = new WordedNumber();
        this.history = [this.currentWordedNumber];
        this.historyIndex = 0;
        this.searchActive = false;
        this.searchInterval = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.numberText = document.getElementById('numberText');
        this.numberDisplay = document.getElementById('numberDisplay');
        this.buttonsContainer = document.getElementById('buttonsContainer');
        this.resetBtn = document.getElementById('resetBtn');
        this.randomBtn = document.getElementById('randomBtn');
        this.backBtn = document.getElementById('backBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.stopSearchBtn = document.getElementById('stopSearchBtn');
        
        // String matching elements
        this.matchBtn = document.getElementById('matchBtn');
        this.matchPanel = document.getElementById('matchPanel');
        this.targetString = document.getElementById('targetString');
        this.startMatchBtn = document.getElementById('startMatchBtn');
        this.stopMatchBtn = document.getElementById('stopMatchBtn');
        this.matchStats = document.getElementById('matchStats');
        this.matchResults = document.getElementById('matchResults');
        
        // Info panel elements
        this.currentSegment = document.getElementById('currentSegment');
        this.isPowerSegment = document.getElementById('isPowerSegment');
        this.currentPower = document.getElementById('currentPower');
        this.largestPower = document.getElementById('largestPower');
        this.isTerminated = document.getElementById('isTerminated');
        this.segmentsCount = document.getElementById('segmentsCount');
        
        // Search panel elements
        this.searchPanel = document.getElementById('searchPanel');
        this.searchStats = document.getElementById('searchStats');
        this.searchResults = document.getElementById('searchResults');
    }
    
    setupEventListeners() {
        this.resetBtn.addEventListener('click', () => this.reset());
        this.randomBtn.addEventListener('click', () => this.generateRandom());
        this.backBtn.addEventListener('click', () => this.goBack());
        this.searchBtn.addEventListener('click', () => this.startStuckNumberSearch());
        this.stopSearchBtn.addEventListener('click', () => this.stopStuckNumberSearch());
        
        // String matching event listeners
        this.matchBtn.addEventListener('click', () => this.toggleMatchPanel());
        this.startMatchBtn.addEventListener('click', () => this.startStringMatching());
        this.stopMatchBtn.addEventListener('click', () => this.stopStringMatching());
        
        // Allow Enter key in the target string input
        this.targetString.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startStringMatching();
            }
        });
    }
    
    updateDisplay() {
        // Update number text
        const text = this.currentWordedNumber.numberText || '(start)';
        this.numberText.textContent = text;
        
        // Update display styling based on termination status
        if (this.currentWordedNumber.isTerminated) {
            this.numberDisplay.classList.add('terminated');
        } else {
            this.numberDisplay.classList.remove('terminated');
        }
        
        // Update info panel
        this.updateInfoPanel();
        
        // Update extension buttons
        this.updateExtensionButtons();
        
        // Update back button
        this.backBtn.disabled = this.historyIndex <= 0;
    }
    
    updateInfoPanel() {
        this.currentSegment.textContent = this.currentWordedNumber.segmentHead.id || 'unknown';
        this.isPowerSegment.textContent = this.currentWordedNumber.isPowerSegment ? 'Yes' : 'No';
        this.currentPower.textContent = this.currentWordedNumber.currentPower;
        this.largestPower.textContent = this.currentWordedNumber.largestPower === Infinity ? '∞' : this.currentWordedNumber.largestPower;
        this.isTerminated.textContent = this.currentWordedNumber.isTerminated ? 'Yes' : 'No';
        this.segmentsCount.textContent = this.currentWordedNumber.segments.length;
    }
    
    updateExtensionButtons() {
        // Clear existing buttons
        this.buttonsContainer.innerHTML = '';
        
        if (this.currentWordedNumber.isTerminated) {
            this.buttonsContainer.innerHTML = '<div class="no-options">Number is complete! Use Reset to start over.</div>';
            return;
        }
        
        try {
            const validNexts = this.currentWordedNumber.getValidNexts();
            
            if (validNexts.length === 0) {
                this.buttonsContainer.innerHTML = '<div class="no-options">No valid extensions available.</div>';
                return;
            }
            
            // If there's only one option, select it automatically
            if (validNexts.length === 1) {
                const segment = validNexts[0];
                const displayText = segment.text || '(empty)';
                this.buttonsContainer.innerHTML = `<div class="auto-selected">Auto-selected: ${segment.id}: "${displayText}"</div>`;
                
                // Automatically extend with the only option immediately
                this.extendWith(segment);
                return;
            }
            
            // Create buttons for each valid extension
            validNexts.forEach(segment => {
                const button = document.createElement('button');
                button.className = 'extend-btn';
                
                // Create button text showing what will be added
                const displayText = segment.text || '(empty)';
                const buttonText = `${segment.id}: "${displayText}"`;
                button.textContent = buttonText;
                
                // Add click handler
                button.addEventListener('click', () => this.extendWith(segment));
                
                this.buttonsContainer.appendChild(button);
            });
            
        } catch (error) {
            console.error('Error getting valid extensions:', error);
            this.buttonsContainer.innerHTML = '<div class="no-options">Error getting valid extensions.</div>';
        }
    }
    
    extendWith(segment) {
        try {
            const newWordedNumber = this.currentWordedNumber.extend(segment);
            
            // Add to history (remove any future history if we're not at the end)
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(newWordedNumber);
            this.historyIndex++;
            
            this.currentWordedNumber = newWordedNumber;
            this.updateDisplay();
            
        } catch (error) {
            console.error('Error extending WordedNumber:', error);
            alert('Error extending number: ' + error.message);
        }
    }
    
    reset() {
        this.currentWordedNumber = new WordedNumber();
        this.history = [this.currentWordedNumber];
        this.historyIndex = 0;
        this.updateDisplay();
    }
    
    generateRandom() {
        try {
            let wn = new WordedNumber();
            let attempts = 0;
            const maxAttempts = 100;
            
            while (!wn.isTerminated && attempts < maxAttempts) {
                const validNexts = wn.getValidNexts();
                if (validNexts.length === 0) {
                    break;
                }
                
                const randomSegment = validNexts[Math.floor(Math.random() * validNexts.length)];
                wn = wn.extend(randomSegment);
                attempts++;
            }
            
            if (attempts >= maxAttempts) {
                console.warn('Random generation stopped after max attempts');
            }
            
            this.currentWordedNumber = wn;
            this.history = [wn];
            this.historyIndex = 0;
            this.updateDisplay();
            
        } catch (error) {
            console.error('Error generating random number:', error);
            alert('Error generating random number: ' + error.message);
        }
    }
    
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentWordedNumber = this.history[this.historyIndex];
            this.updateDisplay();
        }
    }
    
    startStuckNumberSearch() {
        if (this.searchActive) return;
        
        this.searchActive = true;
        this.searchBtn.disabled = true;
        this.searchPanel.style.display = 'block';
        this.searchResults.innerHTML = '';
        
        let attempts = 0;
        let stuckFound = 0;
        const maxAttempts = 1000000000;
        const batchSize = 50000; // Process multiple attempts per interval for better performance
        
        this.searchInterval = setInterval(() => {
            // Process multiple attempts in batches to reduce interval overhead
            for (let batch = 0; batch < batchSize && attempts < maxAttempts; batch++) {
                try {
                    attempts++;
                    
                    // Generate a random WordedNumber and see if it gets stuck
                    let wn = new WordedNumber();
                    let steps = 0;
                    const maxSteps = 50; // Reduced from 100 to find stuck cases faster
                    
                    while (!wn.isTerminated && steps < maxSteps) {
                        const validNexts = wn.getValidNexts();
                        
                        // Check if we found a stuck number (not terminated but no valid extensions)
                        if (validNexts.length === 0 && !wn.isTerminated) {
                            stuckFound++;
                            this.addStuckNumberResult(wn, attempts, stuckFound);
                            break;
                        }
                        
                        if (validNexts.length === 0) {
                            break; // Properly terminated
                        }
                        
                        // Pick a random extension - use faster random selection
                        const randomIndex = Math.floor(Math.random() * validNexts.length);
                        wn = wn.extend(validNexts[randomIndex]);
                        steps++;
                    }
                    
                } catch (error) {
                    console.error('Error during search:', error);
                    // Continue with next attempt
                }
            }
            
            // Update stats every 500 attempts instead of 100 for less DOM manipulation
            if (attempts % 500 === 0) {
                this.updateSearchStats(attempts, stuckFound, maxAttempts);
            }
            
            // Stop after max attempts
            if (attempts >= maxAttempts) {
                this.stopStuckNumberSearch();
            }
        }, 50); // Increased interval to 50ms for less frequent but larger batches
    }
    
    stopStuckNumberSearch() {
        if (this.searchInterval) {
            clearInterval(this.searchInterval);
            this.searchInterval = null;
        }
        this.searchActive = false;
        this.searchBtn.disabled = false;
        
        const finalStats = this.searchStats.textContent;
        this.searchStats.textContent = finalStats.replace('Searching...', 'Search completed.');
    }
    
    updateSearchStats(attempts, found, maxAttempts) {
        const percentage = ((attempts / maxAttempts) * 100).toFixed(1);
        this.searchStats.textContent = `Searching... ${attempts}/${maxAttempts} attempts (${percentage}%) - Found ${found} stuck numbers`;
    }
    
    addStuckNumberResult(wordedNumber, attemptNumber, foundNumber) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'stuck-number';
        
        const numberText = wordedNumber.numberText || '(empty)';
        const segmentInfo = `Segments: ${wordedNumber.segments.length}, Current: ${wordedNumber.segmentHead.id}`;
        const powerInfo = `Power: ${wordedNumber.currentPower}, Largest: ${wordedNumber.largestPower === Infinity ? '∞' : wordedNumber.largestPower}`;
        
        resultDiv.innerHTML = `
            <strong>Stuck #${foundNumber} (attempt #${attemptNumber})</strong><br>
            Text: "${numberText}"<br>
            ${segmentInfo}<br>
            ${powerInfo}<br>
            Is Power Segment: ${wordedNumber.isPowerSegment ? 'Yes' : 'No'}
        `;
        
        // Add click handler to load this stuck number
        resultDiv.style.cursor = 'pointer';
        resultDiv.addEventListener('click', () => {
            this.currentWordedNumber = wordedNumber;
            this.history = [wordedNumber];
            this.historyIndex = 0;
            this.updateDisplay();
        });
        
        this.searchResults.appendChild(resultDiv);
        
        // Auto-scroll to show latest result
        this.searchResults.scrollTop = this.searchResults.scrollHeight;
    }
    
    // String Matching Methods
    toggleMatchPanel() {
        if (this.matchPanel.style.display === 'none' || !this.matchPanel.style.display) {
            this.matchPanel.style.display = 'block';
            this.targetString.focus();
        } else {
            this.matchPanel.style.display = 'none';
        }
    }
    
    startStringMatching() {
        const targetStr = this.targetString.value.trim();
        if (!targetStr) {
            this.matchStats.textContent = 'Please enter a target string to match.';
            return;
        }
        
        this.matchActive = true;
        this.startMatchBtn.disabled = true;
        this.matchStats.textContent = `Attempting to match: "${targetStr}"...`;
        this.matchResults.innerHTML = '';
        
        // Run matching asynchronously
        setTimeout(async () => {
            try {
                const matcher = new StringMatcher();
                const result = await this.runStringMatchingWithProgress(matcher, targetStr);
                
                if (result.success) {
                    this.displayMatchSuccess(result, targetStr);
                } else {
                    this.displayMatchFailure(result, targetStr);
                }
                
            } catch (error) {
                console.error('String matching error:', error);
                this.matchStats.textContent = 'String matching failed: ' + error.message;
            }
            
            this.matchActive = false;
            this.startMatchBtn.disabled = false;
        }, 100);
    }
    
    async runStringMatchingWithProgress(matcher, targetStr) {
        // Show progress
        this.matchStats.textContent = `Searching for path to match "${targetStr}"...`;
        
        // Try multiple strategies
        const result = matcher.tryToMatchStringMultipleStrategies(targetStr);
        
        // Update progress
        this.matchStats.textContent = result.success ? 
            `✓ Successfully matched "${targetStr}"!` : 
            `✗ Failed to match "${targetStr}"`;
            
        return result;
    }
    
    displayMatchSuccess(result, targetStr) {
        this.matchStats.textContent = `✓ SUCCESS! Found a way to build "${targetStr}" - ${result.reason}`;
        
        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 10px 0;';
        
        let content = `<h4 style="color: #155724; margin: 0 0 10px 0;">✓ Match Found!</h4>`;
        content += `<div style="font-family: monospace; margin: 5px 0;"><strong>Target:</strong> "${targetStr}"</div>`;
        content += `<div style="font-family: monospace; margin: 5px 0;"><strong>Result:</strong> "${result.wordedNumber.numberText}"</div>`;
        content += `<div style="margin: 5px 0;"><strong>Details:</strong> ${result.reason}</div>`;
        
        if (result.path && result.path.length > 0) {
            content += `<div style="margin: 10px 0;"><strong>Construction Path:</strong></div>`;
            content += `<div style="font-family: monospace; font-size: 11px; background: #f8f9fa; padding: 8px; border-radius: 3px; max-height: 150px; overflow-y: auto;">`;
            
            const pathSteps = [];
            let currentText = '';
            for (const segment of result.path) {
                currentText += segment.text;
                pathSteps.push(`${segment.id}: "${segment.text}" → "${currentText}"`);
            }
            content += pathSteps.join('<br>');
            content += `</div>`;
        }
        
        successDiv.innerHTML = content;
        this.matchResults.appendChild(successDiv);
    }
    
    displayMatchFailure(result, targetStr) {
        this.matchStats.textContent = `✗ No path found to match "${targetStr}" - ${result.reason}`;
        
        const failureDiv = document.createElement('div');
        failureDiv.style.cssText = 'background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 10px 0;';
        
        let content = `<h4 style="color: #721c24; margin: 0 0 10px 0;">✗ No Match Found</h4>`;
        content += `<div style="font-family: monospace; margin: 5px 0;"><strong>Target:</strong> "${targetStr}"</div>`;
        content += `<div style="margin: 5px 0;"><strong>Reason:</strong> ${result.reason}</div>`;
        content += `<div style="margin: 5px 0;"><strong>Search Attempts:</strong> ${result.attempts || 'unknown'}</div>`;
        
        // Add some suggestions
        content += `<div style="margin: 10px 0; font-size: 13px; color: #721c24;">`;
        content += `<strong>Suggestions:</strong><br>`;
        content += `• Try a shorter or simpler string<br>`;
        content += `• Check if the string contains characters that might not be reachable<br>`;
        content += `• Consider that some strings might be impossible to construct with WordedNumber rules`;
        content += `</div>`;
        
        failureDiv.innerHTML = content;
        this.matchResults.appendChild(failureDiv);
    }
    
    stopStringMatching() {
        this.matchActive = false;
        this.startMatchBtn.disabled = false;
        this.matchStats.textContent = 'String matching stopped.';
    }
}

// Initialize the viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.numberViewer = new NumberViewer();
    } catch (error) {
        console.error('Error initializing NumberViewer:', error);
        document.getElementById('numberText').textContent = 'Error loading application: ' + error.message;
    }
});

// Helper function to add random element selection
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}