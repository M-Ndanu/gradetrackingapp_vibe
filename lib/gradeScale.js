const GRADE_BANDS = [
  { minimum: 90, letter: "A", points: 4.0, colorBand: "dark-green" },
  { minimum: 87, letter: "A-", points: 3.7, colorBand: "dark-green" },
  { minimum: 84, letter: "B+", points: 3.3, colorBand: "light-green" },
  { minimum: 80, letter: "B", points: 3.0, colorBand: "light-green" },
  { minimum: 77, letter: "B-", points: 2.7, colorBand: "light-green" },
  { minimum: 74, letter: "C+", points: 2.3, colorBand: "yellow" },
  { minimum: 70, letter: "C", points: 2.0, colorBand: "orange" },
  { minimum: 67, letter: "C-", points: 1.7, colorBand: "red" },
  { minimum: 64, letter: "D+", points: 1.3, colorBand: "red" },
  { minimum: 62, letter: "D", points: 1.0, colorBand: "red" },
  { minimum: 60, letter: "D-", points: 0.7, colorBand: "red" },
  { minimum: 0, letter: "F", points: 0.0, colorBand: "red" },
];

function getGradeForPercentage(percent) {
  if (!Number.isFinite(percent)) {
    throw new Error("A finite percentage is required.");
  }

  const band = GRADE_BANDS.find(({ minimum }) => percent >= minimum);

  return {
    letter: band.letter,
    points: band.points,
    colorBand: band.colorBand,
    isFail: percent < 70,
  };
}

module.exports = { getGradeForPercentage };