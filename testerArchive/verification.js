// String Matching Verification for WordedNumber
// This module provides functionality to try to build a WordedNumber that matches a given target string

class StringMatcher {
    constructor() {
        this.maxDepth = 100; // Prevent infinite searching
        this.maxAttempts = 10000; // Maximum search attempts
    }

    // Try to build a WordedNumber to match the target string starting from scratch
    static tryToMatchString(targetString) {
        const matcher = new StringMatcher();
        return matcher.tryToMatchStringFrom(new WordedNumber(), targetString);
    }

    // Improved search with word boundary awareness
    tryToMatchStringFrom(startingWordedNumber, targetString) {
        // First try a smart decomposition approach
        const smartResult = this.trySmartDecomposition(targetString);
        if (smartResult.success) {
            return smartResult;
        }

        // Fall back to original breadth-first search with higher limits
        return this.tryBruteForceSearch(startingWordedNumber, targetString);
    }

    // Smart decomposition that breaks the target into word segments
    trySmartDecomposition(targetString) {
        // Split the target string into words
        const words = targetString.trim().split(/\s+/);

        // Identify logical number segments (looking for illion endings)
        const segments = this.identifyNumberSegments(words);

        // Try to build each segment separately
        let result = new WordedNumber();
        let totalAttempts = 0;

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            
            // Calculate the target text if we append this segment
            let targetText = result.numberText;
            if (targetText.length > 0 && !targetText.endsWith(" ")) {
                targetText += " ";
            }
            targetText += segment;

            // Try to extend the current result to match the target
            const segmentResult = this.extendToMatchSegment(result, targetText);
            totalAttempts += segmentResult.attempts;

            if (segmentResult.success) {
                result = segmentResult.wordedNumber;
            } else {
                return {
                    success: false,
                    wordedNumber: null,
                    reason: `Smart decomposition failed at segment ${i + 1}: "${segment}" (${segmentResult.reason})`,
                    attempts: totalAttempts
                };
            }
        }

        // Check if the final result matches our target
        if (result.numberText === targetString) {
            return {
                success: true,
                wordedNumber: result,
                reason: `Smart decomposition succeeded with ${segments.length} segments after ${totalAttempts} total attempts`,
                path: this.extractPath(result),
                attempts: totalAttempts
            };
        } else {
            return {
                success: false,
                wordedNumber: null,
                reason: `Smart decomposition built "${result.numberText}" but expected "${targetString}"`,
                attempts: totalAttempts
            };
        }
    }

    // Identify logical number segments by finding natural breaking points
    identifyNumberSegments(words) {
        const segments = [];
        let currentSegment = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            currentSegment.push(word);

            // Check if this word ends a logical segment
            if (this.isSegmentEndingWord(word)) {
                // This word completes a segment
                segments.push(currentSegment.join(" "));
                currentSegment = [];
            } else if (i === words.length - 1) {
                // Last word - finish the segment
                segments.push(currentSegment.join(" "));
            }
        }

        // If we have empty segments, merge them
        return segments.filter(s => s.trim().length > 0);
    }

    // Check if a word typically ends a number segment
    isSegmentEndingWord(word) {
        // Words ending in "illion" usually complete a segment
        if (word.endsWith('illion')) {
            return true;
        }
        
        // "thousand" also usually completes a segment
        if (word === 'thousand') {
            return true;
        }

        return false;
    }

    // Extend a WordedNumber to match a specific target segment
    extendToMatchSegment(startingWordedNumber, targetString) {
        const queue = [{ wordedNumber: startingWordedNumber, depth: 0 }];
        const visited = new Set();
        let attempts = 0;
        const maxSegmentAttempts = 200000; // Much higher for complex segments
        
        while (queue.length > 0 && attempts < maxSegmentAttempts) {
            attempts++;
            const { wordedNumber, depth } = queue.shift();
            
            if (depth > this.maxDepth * 3) { // Allow deeper searches for segments
                continue;
            }
            
            // Check if we've matched the target string
            if (wordedNumber.numberText === targetString) {
                return { 
                    success: true, 
                    wordedNumber: wordedNumber, 
                    reason: `Segment match at depth ${depth} after ${attempts} attempts`,
                    attempts: attempts
                };
            }
            
            // Check if we've gone past the target
            if (wordedNumber.numberText.length > targetString.length) {
                continue;
            }
            
            if (wordedNumber.numberText.length === targetString.length && 
                wordedNumber.numberText > targetString) {
                continue;
            }
            
            // Check if the current text is not a prefix of the target
            if (!targetString.startsWith(wordedNumber.numberText)) {
                continue;
            }
            
            // Avoid revisiting the same state
            const stateKey = this.createStateKey(wordedNumber);
            if (visited.has(stateKey)) {
                continue;
            }
            visited.add(stateKey);
            
            // If terminated but not matching, this path failed
            if (wordedNumber.isTerminated) {
                continue;
            }
            
            // Try all valid extensions
            try {
                const validNexts = wordedNumber.getValidNexts();
                for (const segment of validNexts) {
                    try {
                        const extended = wordedNumber.extend(segment);
                        // More generous promising check for segments
                        if (this.isPromisingExtensionForSegment(extended, targetString)) {
                            queue.push({ wordedNumber: extended, depth: depth + 1 });
                        }
                    } catch (error) {
                        continue;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        return { 
            success: false, 
            wordedNumber: null, 
            reason: `Segment search failed for "${targetString}" after ${attempts} attempts`,
            attempts: attempts
        };
    }

    // More lenient promising check for segment matching
    isPromisingExtensionForSegment(wordedNumber, targetString) {
        // Must still be a prefix
        if (!targetString.startsWith(wordedNumber.numberText)) {
            return false;
        }
        
        // For segments, be more generous about continuing the search
        const progress = wordedNumber.numberText.length / targetString.length;
        
        // If we're making good progress, continue
        if (progress > 0.1) {
            return true;
        }
        
        // For early stages, use the original heuristic but be more lenient
        if (wordedNumber.numberText.length > targetString.length * 0.9) {
            const remaining = targetString.substring(wordedNumber.numberText.length);
            if (remaining.length > 0) {
                const nextChar = remaining[0];
                const currentText = wordedNumber.numberText;
                if (currentText.length > 0) {
                    const lastChar = currentText[currentText.length - 1];
                    // More lenient character distance check
                    if (Math.abs(nextChar.charCodeAt(0) - lastChar.charCodeAt(0)) > 25) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }

    // Original brute force search as fallback
    tryBruteForceSearch(startingWordedNumber, targetString) {
        // Use breadth-first search to find a path to the target string
        const queue = [{ wordedNumber: startingWordedNumber, depth: 0 }];
        const visited = new Set();
        let attempts = 0;
        const maxBruteAttempts = 100000; // Much higher limit for complex strings
        
        while (queue.length > 0 && attempts < maxBruteAttempts) {
            attempts++;
            const { wordedNumber, depth } = queue.shift();
            
            if (depth > this.maxDepth * 2) { // Allow deeper searches
                continue;
            }
            
            // Check if we've matched the target string
            if (wordedNumber.numberText === targetString) {
                return { 
                    success: true, 
                    wordedNumber: wordedNumber, 
                    reason: `Brute force found match at depth ${depth} after ${attempts} attempts`,
                    path: this.extractPath(wordedNumber),
                    attempts: attempts
                };
            }
            
            // Check if we've gone past the target (alphabetically or by length)
            if (wordedNumber.numberText.length > targetString.length) {
                continue; // This path won't lead to the target - too long
            }
            
            if (wordedNumber.numberText.length === targetString.length && 
                wordedNumber.numberText > targetString) {
                continue; // This path won't lead to the target - alphabetically past it
            }
            
            // Check if the current text is not a prefix of the target
            if (!targetString.startsWith(wordedNumber.numberText)) {
                continue; // This path won't lead to the target - not a valid prefix
            }
            
            // Avoid revisiting the same state
            const stateKey = this.createStateKey(wordedNumber);
            if (visited.has(stateKey)) {
                continue;
            }
            visited.add(stateKey);
            
            // If terminated but not matching, this path failed
            if (wordedNumber.isTerminated) {
                continue;
            }
            
            // Try all valid extensions
            try {
                const validNexts = wordedNumber.getValidNexts();
                for (const segment of validNexts) {
                    try {
                        const extended = wordedNumber.extend(segment);
                        // Only add promising extensions to the queue
                        if (this.isPromisingExtension(extended, targetString)) {
                            queue.push({ wordedNumber: extended, depth: depth + 1 });
                        }
                    } catch (error) {
                        // Skip invalid extensions
                        continue;
                    }
                }
            } catch (error) {
                // Skip if we can't get valid nexts
                continue;
            }
        }
        
        return { 
            success: false, 
            wordedNumber: null, 
            reason: attempts >= maxBruteAttempts ? 
                `Brute force search exceeded maximum attempts (${maxBruteAttempts})` : 
                `No brute force path found to match "${targetString}" after ${attempts} attempts`,
            attempts: attempts
        };
    }

    // Create a unique state key for memoization
    createStateKey(wordedNumber) {
        return `${wordedNumber.numberText}|${wordedNumber.segmentHead.id}|${wordedNumber.isPowerSegment}|${wordedNumber.currentPower}|${wordedNumber.largestPower}`;
    }

    // Check if an extension looks promising (simple heuristics)
    isPromisingExtension(wordedNumber, targetString) {
        // Must still be a prefix
        if (!targetString.startsWith(wordedNumber.numberText)) {
            return false;
        }
        
        // If we're getting close to the target length, be more selective
        if (wordedNumber.numberText.length > targetString.length * 0.8) {
            // The remaining characters should match what we need
            const remaining = targetString.substring(wordedNumber.numberText.length);
            // Simple check: the next character should be alphabetically reasonable
            if (remaining.length > 0) {
                const nextChar = remaining[0];
                const currentText = wordedNumber.numberText;
                if (currentText.length > 0) {
                    const lastChar = currentText[currentText.length - 1];
                    // Very rough heuristic: next character shouldn't be too far away alphabetically
                    if (Math.abs(nextChar.charCodeAt(0) - lastChar.charCodeAt(0)) > 15) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }

    // Extract the path taken to reach the WordedNumber
    extractPath(wordedNumber) {
        if (!wordedNumber.segments) {
            return [];
        }
        
        return wordedNumber.segments.map(segment => ({
            id: segment.id,
            text: segment.text,
            val: segment.val
        }));
    }

    // Try multiple search strategies for better results
    tryToMatchStringMultipleStrategies(targetString) {
        console.log(`Attempting to match string: "${targetString}"`);
        
        // Strategy 1: Standard breadth-first search
        let result = this.tryToMatchStringFrom(new WordedNumber(), targetString);
        if (result.success) {
            console.log(`✓ Found match using standard BFS: ${result.reason}`);
            return result;
        }
        
        console.log(`✗ Standard BFS failed: ${result.reason}`);
        
        // Strategy 2: Try with increased depth limit
        const originalMaxDepth = this.maxDepth;
        this.maxDepth = 200;
        result = this.tryToMatchStringFrom(new WordedNumber(), targetString);
        this.maxDepth = originalMaxDepth;
        
        if (result.success) {
            console.log(`✓ Found match using deeper search: ${result.reason}`);
            return result;
        }
        
        console.log(`✗ Deep search failed: ${result.reason}`);
        
        // Strategy 3: Try with increased attempt limit
        const originalMaxAttempts = this.maxAttempts;
        this.maxAttempts = 50000;
        result = this.tryToMatchStringFrom(new WordedNumber(), targetString);
        this.maxAttempts = originalMaxAttempts;
        
        if (result.success) {
            console.log(`✓ Found match using extended search: ${result.reason}`);
            return result;
        }
        
        console.log(`✗ All strategies failed for "${targetString}"`);
        return result;
    }

    // Batch test multiple target strings
    batchTest(targetStrings) {
        const results = [];
        
        console.log(`Testing ${targetStrings.length} target strings...`);
        
        for (let i = 0; i < targetStrings.length; i++) {
            const targetString = targetStrings[i];
            console.log(`\n[${i + 1}/${targetStrings.length}] Testing: "${targetString}"`);
            
            const result = this.tryToMatchStringMultipleStrategies(targetString);
            results.push({
                target: targetString,
                ...result
            });
            
            // Progress update
            if ((i + 1) % 10 === 0) {
                const successes = results.filter(r => r.success).length;
                console.log(`Progress: ${i + 1}/${targetStrings.length} completed (${successes} successes)`);
            }
        }
        
        return results;
    }

    // Generate a report from batch test results
    generateBatchReport(results) {
        const successes = results.filter(r => r.success);
        const failures = results.filter(r => !r.success);
        
        let report = `\n=== STRING MATCHING VERIFICATION REPORT ===\n`;
        report += `Total tested: ${results.length}\n`;
        report += `Successful matches: ${successes.length} (${((successes.length / results.length) * 100).toFixed(1)}%)\n`;
        report += `Failed matches: ${failures.length} (${((failures.length / results.length) * 100).toFixed(1)}%)\n\n`;
        
        if (successes.length > 0) {
            report += `SUCCESSFUL MATCHES:\n`;
            successes.forEach(result => {
                report += `  ✓ "${result.target}" - ${result.reason}\n`;
                if (result.path && result.path.length > 0) {
                    const pathStr = result.path.map(p => p.id).join(' → ');
                    report += `    Path: ${pathStr}\n`;
                }
            });
            report += `\n`;
        }
        
        if (failures.length > 0) {
            report += `FAILED MATCHES (showing first 20):\n`;
            failures.slice(0, 20).forEach(result => {
                report += `  ✗ "${result.target}" - ${result.reason}\n`;
            });
            if (failures.length > 20) {
                report += `    ... and ${failures.length - 20} more failures\n`;
            }
        }
        
        return report;
    }
}

// Convenience function for quick testing
function tryToMatch(targetString) {
    return StringMatcher.tryToMatchString(targetString);
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.StringMatcher = StringMatcher;
    window.tryToMatch = tryToMatch;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StringMatcher, tryToMatch };
}

// For direct script loading, make available globally
if (typeof global !== 'undefined') {
    global.StringMatcher = StringMatcher;
    global.tryToMatch = tryToMatch;
}