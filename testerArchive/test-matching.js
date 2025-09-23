// Test examples for the string matching verification system

// Simple test function to demonstrate string matching
function runStringMatchingTests() {
    console.log("=== STRING MATCHING TESTS ===");
    
    const testStrings = [
        "zero",           // Should be easy - just matches the zero segment
        "one",            // Should be easy - coefficient segment
        "two",            // Should be easy - coefficient segment  
        "three",          // Should be easy - coefficient segment
        "ten",            // Should be easy - coefficient segment
        "twenty",         // Should be easy - coefficient segment
        "one hundred",    // Should be easy - coefficient segment
        "mi",             // Should work - million power segment
        "billion",        // Should work if billion matches "bi" + "lli" + "on"
        "hello",          // Likely impossible
        "test",           // Likely impossible
        "",               // Empty string - should match starting state
        " ",              // Single space - might match some space segments
        "ni",             // Should work - power segment
        "deci",           // Should work - power segment
        "un",             // Should work - power segment
        "centi"           // Should work - power segment
    ];
    
    console.log(`Testing ${testStrings.length} strings...`);
    
    const matcher = new StringMatcher();
    const results = matcher.batchTest(testStrings);
    
    // Display results
    const report = matcher.generateBatchReport(results);
    console.log(report);
    
    // Return results for further analysis
    return results;
}

// Function to test specific interesting cases
function testInterestingCases() {
    console.log("\n=== TESTING INTERESTING CASES ===");
    
    const interestingCases = [
        {
            description: "Empty string (should match starting state)",
            target: ""
        },
        {
            description: "Single space (might match space segments)", 
            target: " "
        },
        {
            description: "Power segment 'ni'",
            target: "ni"
        },
        {
            description: "Million abbreviation 'mi'",
            target: "mi"
        },
        {
            description: "Simple number 'zero'",
            target: "zero"
        },
        {
            description: "Simple number 'one'", 
            target: "one"
        },
        {
            description: "Compound number 'twenty'",
            target: "twenty"
        },
        {
            description: "Hundred 'one hundred'",
            target: "one hundred"
        }
    ];
    
    for (const testCase of interestingCases) {
        console.log(`\nTesting: ${testCase.description}`);
        console.log(`Target: "${testCase.target}"`);
        
        const result = StringMatcher.tryToMatchString(testCase.target);
        
        if (result.success) {
            console.log(`✓ SUCCESS: ${result.reason}`);
            if (result.path) {
                const pathStr = result.path.map(p => `${p.id}:"${p.text}"`).join(' → ');
                console.log(`  Path: ${pathStr}`);
            }
        } else {
            console.log(`✗ FAILED: ${result.reason}`);
        }
    }
}

// Export functions for use in console
if (typeof window !== 'undefined') {
    window.runStringMatchingTests = runStringMatchingTests;
    window.testInterestingCases = testInterestingCases;
}