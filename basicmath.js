function calculateFromStatement(statement) {
    // Convert statement to lowercase to handle case insensitivity
    statement = statement.toLowerCase();

    // Replace words with corresponding operators
    statement = statement
      .replace(
        /\bsum\b|\bsum of\b|\bsumof\b|\bplus\b|\badd\b|\baddition\b| \bfrom\b/g,
        "+"
      )
      .replace(
        /\bminus\b|\bsubtract\b|\bsubtraction\b|\bnegative\b|\bremove\b/g,
        "-"
      )
      .replace(
        /\bproduct\b|\bproduct of\b|\bproductof\b|\bmultiply\b|\bmultiplication\b|\btimes\b|\bmultiplied\b/g,
        "*"
      )
      .replace(/\bdivision\b|\bdivide\b|\bdivided\b/g, "/")
      .replace(/,/g, "")
      .replace(/-/g, " - ") // Add spaces around minus for easier splitting
      .replace(/\+/g, " + ")
      .replace(/\*/g, " * ")
      .replace(/\//g, " / ");

    // Split the statement into tokens
    let tokens = statement.split(" ").filter((token) => token);

    // Convert numbers and handle negative numbers
    let numbers = [];
    let operations = [];

    for (let i = 0; i < tokens.length; i++) {
      if (!isNaN(tokens[i])) {
        numbers.push(parseFloat(tokens[i]));
      } else if (tokens[i] === "-") {
        if (i === 0 || (tokens[i - 1] && isNaN(tokens[i - 1]))) {
          // This is a negative number
          numbers.push(parseFloat(tokens[i] + tokens[i + 1]));
          i++;
        } else {
          operations.push(tokens[i]);
        }
      } else if (["+", "*", "/"].includes(tokens[i])) {
        operations.push(tokens[i]);
      }
    }

    // Check for NaN or undefined numbers and return an error if found
    if (numbers.some((num) => isNaN(num) || num === undefined)) {
      return "Invalid numbers in the statement.";
    }

    // Check for empty operations or mismatch in numbers and operations length
    if (operations.length === 0 || numbers.length !== operations.length + 1) {
      return "Invalid operations in the statement.";
    }

    // Perform the calculation
    let result = numbers[0];
    for (let i = 0; i < operations.length; i++) {
      switch (operations[i]) {
        case "+":
          result += numbers[i + 1];
          break;
        case "-":
          result -= numbers[i + 1];
          break;
        case "*":
          result *= numbers[i + 1];
          break;
        case "/":
          result /= numbers[i + 1];
          break;
        default:
          return "Invalid operation detected.";
      }
    }

    // Check for NaN result and return an error if found
    if (isNaN(result)) {
      return "Calculation resulted in an invalid number.";
    }

    return result;
  }

  function calculatePercentage(statement) {
    // Convert statement to lowercase to handle case insensitivity
    statement = statement.toLowerCase();

    // Replace the word "percent" with "%" for uniformity
    statement = statement.replace(/percent/g, "%");

    // Regular expression to match percentage expressions like "50% of 200"
    const percentageRegex = /(\d+)%\s+of\s+(\d+)/g;

    // Find all matches in the statement
    let matches = [];
    let match;
    while ((match = percentageRegex.exec(statement)) !== null) {
      matches.push({
        percentage: parseFloat(match[1]),
        base: parseFloat(match[2]),
      });
    }

    // If no matches found, return an error
    if (matches.length === 0) {
      return "Error: No valid percentage expressions found in the statement.";
    }

    // Calculate the results for all matches
    let results = matches.map(
      ({ percentage, base }) => (percentage / 100) * base
    );

    // If there's only one result, return it directly
    if (results.length === 1) {
      return results[0];
    }

    // Otherwise, return an array of results
    return results;
  }

  function solveEquation(statement) {
    // Convert statement to lowercase to handle case insensitivity
    statement = statement.toLowerCase();
  
    // Replace words with corresponding operators
    statement = statement
      .replace(
        /\bsum\b|\bsum of\b|\bsumof\b|\bplus\b|\badd\b|\baddition\b| \bfrom\b/g,
        "+"
      )
      .replace(
        /\bminus\b|\bsubtract\b|\bsubtraction\b|\bnegative\b|\bremove\b/g,
        "-"
      )
      .replace(
        /\bproduct\b|\bproduct of\b|\bproductof\b|\bmultiply\b|\bmultiplication\b|\btimes\b|\bmultiplied\b/g,
        "*"
      )
      .replace(/\bdivision\b|\bdivide\b|\bdivided\b/g, "/")
      .replace(/\bequation\b|\bfind x in\b|\bsolve the\b|\bstatement\b|\bexpression\b/g, "")
      .replace(/,/g, "")
      .replace(/-/g, " - ") // Add spaces around minus for easier splitting
      .replace(/\+/g, " + ")
      .replace(/\*/g, " * ")
      .replace(/\//g, " / ");
  
    // Split the statement into tokens
    let tokens = statement.split(" ").filter((token) => token);
  
    // Separate numbers, variables, and operations
    let numbers = [];
    let variables = [];
    let operations = [];
  
    for (let i = 0; i < tokens.length; i++) {
      if (!isNaN(tokens[i])) {
        numbers.push(parseFloat(tokens[i]));
      } else if (/^[a-zA-Z]+$/.test(tokens[i])) {
        variables.push(tokens[i]);
      } else if (["+", "-", "*", "/"].includes(tokens[i])) {
        operations.push(tokens[i]);
      }
    }
  
    // Ensure we only have one type of variable
    let uniqueVariables = [...new Set(variables)];
    if (uniqueVariables.length > 1) {
      return "Only one type of variable is supported.";
    }
  
    // Combine terms involving the variable and constants separately
    let variableCoefficient = 0;
    let constantTerm = 0;
  
    let isNegative = false;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === "-") {
        isNegative = true;
      } else if (!isNaN(tokens[i])) {
        let number = parseFloat(tokens[i]);
        if (isNegative) {
          number = -number;
          isNegative = false;
        }
        constantTerm += number;
      } else if (/^[a-zA-Z]+$/.test(tokens[i])) {
        let coefficient = 1;
        if (i > 0 && !isNaN(tokens[i - 1])) {
          coefficient = parseFloat(tokens[i - 1]);
        }
        if (isNegative) {
          coefficient = -coefficient;
          isNegative = false;
        }
        variableCoefficient += coefficient;
      }
    }
  
    // Simplify the equation
    if (variableCoefficient === 0) {
      return "No solution or infinite solutions (variable term cancels out).";
    }
  
    let result = -constantTerm / variableCoefficient;
    return `${uniqueVariables[0]} = ${result}`;
  }
  