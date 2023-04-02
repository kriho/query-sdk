export function parseNumber(value: string) {
  if (value == null) {
    return null;
  }
  try {
    if (value.includes(".")) {
      return parseFloat(value);
    }
    return parseInt(value);
  } catch {
    return null;
  }
}

export function similarity(left: string, right: string) {
  var longer = left;
  var shorter = right;
  if (left.length < right.length) {
    longer = right;
    shorter = left;
  }
  var longerLength = longer.length;
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

export function editDistance(left: string, right: string) {
  left = left.toLowerCase();
  right = right.toLowerCase();
  var costs: number[]= [];
  for (var i = 0; i <= left.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= right.length; j++) {
      if (i == 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (left.charAt(i - 1) != right.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[right.length] = lastValue;
    }
  }
  return costs[right.length];
}

export function escapeUri(input: string) {
  return encodeURI(input);
}

// https://en.wikipedia.org/wiki/ANSI_escape_code

export function colorError(message: string) {
  return "\x1b[31m" + message + "\x1b[0m";
}

export function colorWarning(message: string) {
  return "\x1b[33m" + message + "\x1b[0m";
}

export function colorQuery(message: string) {
  return "\x1b[35m" + message + "\x1b[0m";
}

export function colorDebug(message: string) {
  return "\x1b[36m" + message + "\x1b[0m";
}