export function calculateFromStatement(statement) {
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

export function calculatePercentage(statement) {
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

export function solveEquation(statement) {
  // Convert statement to lowercase and remove spaces
  statement = statement.toLowerCase().replace(/\s+/g, "");

  // Extract the left-hand side (lhs) and right-hand side (rhs) of the equation
  const [lhs, rhs] = statement.split("=");
  if (!lhs || !rhs) {
    return "Invalid statement. Please provide a valid algebraic expression.";
  }

  // Function to parse terms and coefficients
  function parseTerms(expression) {
    const termPattern = /([+-]?[^-+]+)/g;
    const terms = expression.match(termPattern);
    let coefficientSum = 0;
    let constantSum = 0;

    terms.forEach((term) => {
      if (term.includes("x")) {
        let coefficient = term.replace("x", "");
        if (coefficient === "" || coefficient === "+") coefficient = 1;
        else if (coefficient === "-") coefficient = -1;
        coefficientSum += parseFloat(coefficient);
      } else {
        constantSum += parseFloat(term);
      }
    });

    return { coefficientSum, constantSum };
  }

  // Parse the left-hand side and right-hand side terms
  const lhsTerms = parseTerms(lhs);
  const rhsTerms = parseTerms(rhs);

  // Calculate the net coefficients and constants
  const netCoefficient = lhsTerms.coefficientSum - rhsTerms.coefficientSum;
  const netConstant = rhsTerms.constantSum - lhsTerms.constantSum;
  console.log(netCoefficient);
  console.log(netConstant);

  // Solve for x
  if (netCoefficient === 0) {
    if (netConstant === 0) {
      return "Infinite solutions.";
    } else {
      return "No valid solution.";
    }
  }

  const x = netConstant / netCoefficient;
  return { x: x };
}

export function solveStatistics(statement) {
  statement = statement.toLowerCase();

  // Determine the type of calculation requested
  let type;
  if (statement.includes("mean")) {
    type = "mean";
  } else if (statement.includes("median")) {
    type = "median";
  } else if (statement.includes("mode")) {
    type = "mode";
  } else if (statement.includes("standard deviation")) {
    type = "standard deviation";
  } else {
    return "Invalid statement. Please specify mean, median, mode, or standard deviation.";
  }

  // Replace the word "and" with a comma and remove other words
  statement = statement.replace(/\band\b/g, ",").replace(/[^0-9.,-]/g, "");

  // Extract the numbers from the statement
  const numberPattern = /[-+]?[0-9]*\.?[0-9]+/g;
  const numbers = statement.match(numberPattern).map(Number);

  // Perform the calculation based on the type
  switch (type) {
    case "mean":
      return { mean: mean(numbers) };
    case "median":
      return { median: median(numbers) };
    case "mode":
      return { mode: mode(numbers) };
    case "standard deviation":
      return { standardDeviation: standardDeviation(numbers) };
  }

  // Function to calculate the mean
  function mean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }

  // Function to calculate the median
  function median(data) {
    const sorted = data.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Function to calculate the mode
  function mode(data) {
    const frequency = {};
    data.forEach((value) => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter((key) => frequency[key] === maxFreq)
      .map((val) => Number(val));
  }

  // Function to calculate the standard deviation
  function standardDeviation(data) {
    const dataMean = mean(data);
    const squaredDiffs = data.map((value) => (value - dataMean) ** 2);
    const avgSquaredDiff = mean(squaredDiffs);
    return Math.sqrt(avgSquaredDiff);
  }
}
