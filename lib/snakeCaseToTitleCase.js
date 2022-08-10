function snakeCaseToTitleCase(snake_case, splitChar = '_') {
  let formattedString = snake_case.split(splitChar);
  for (let i = 0; i < formattedString.length; i++) {
    formattedString[i] =
      formattedString[i][0].toUpperCase() + formattedString[i].slice(1);
  }
  return formattedString.join(' ');
}

export default snakeCaseToTitleCase;
