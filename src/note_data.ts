export const scaleNoteCandidates: string[][] = [
    ["B#", "C", "Dbb"],
    ["C#", "Db"],
    ["Cx", "D", "Ebb"],
    ["D#", "Eb"],
    ["Dx", "E", "Fb"],
    ["E#", "F", "Gbb"],
    ["F#", "Gb"],
    ["Fx", "G", "Abb"],
    ["G#", "Ab"],
    ["Gx", "A", "Bbb"],
    ["A#", "Bb", "Cbb"],
    ["Ax", "B", "Cb"]
];


export const abcNotesMidiOrder = ["C", "D", "E", "F", "G", "A", "B"];


export const chromaticScale: string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


export const chordNumeralsMap: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII"
}


/**
 * Either a MIDI note-like thing or a rest. A note should have a note property like "C", "C#" or "Gb".
 * A rest should have a note property of "rest".
 */
export type note = {
  octave: number,
  note: string,
  midi: number,
  scaleDegree?: number
}


export type chord = {
  midi: number[],
  quality: string,
  root: string,
  degree: string,
}


export type chordSpec = {
  intervals: number[]
}


export const chordTypes: Record<string, chordSpec> = {
  "T":       { intervals: [0, 2, 4] },
  "T+7":     { intervals: [0, 2, 4, 6] },
  "T+9":     { intervals: [0, 2, 4, 6, 8] },
  "dyad2":   { intervals: [0, 1] },
  "dyad3":   { intervals: [0, 2] },
  "dyad4":   { intervals: [0, 3] },
  "dyad5":   { intervals: [0, 4] },
  "dyad6":   { intervals: [0, 5] },
  "dyad7":   { intervals: [0, 6] },
  "dyad8":   { intervals: [0, 7] },
  "dyad9":   { intervals: [0, 8] },
  "dyad10":  { intervals: [0, 9] },
  "dyad11":  { intervals: [0, 10] },
  "dyad12":  { intervals: [0, 11] },
};


export const chordIntervalMap: Record<string, {quality: string}> = {
  "0:1":  { quality: "m2", },
  "0:2":  { quality: "M2", },
  "0:3":  { quality: "m3", },
  "0:4":  { quality: "M3", },
  "0:5":  { quality: "P4", },
  "0:6":  { quality: "dim5", },
  "0:7":  { quality: "P5", },
  "0:8":  { quality: "m6", },
  "0:9":  { quality: "M6", },
  "0:10": { quality: "m7", },
  "0:11": { quality: "M7", },
  "0:12": { quality: "oct", },
  "0:13": { quality: "m9", },
  "0:14": { quality: "M9", },
  "0:15": { quality: "m10", },
  "0:16": { quality: "M10", },
  "0:17": { quality: "m11", },
  "0:18": { quality: "M11", },
  "0:19": { quality: "m12", },
  "0:20": { quality: "M12", },

  "0:4:7": { quality: "M", },
  "0:3:7": { quality: "m", },
  "0:4:8": { quality: "aug", },
  "0:3:6": { quality: "dim", },
  "0:5:9": { quality: "M/5" },
  "0:4:9": { quality: "m/3" },
  "0:5:10": { quality: "sus2/2" },
  "0:2:4":  { quality: "WT" },
  "0:3:5":  { quality: "m5bb" },
  "0:2:6":  { quality: "sus25b" },
};


// IMPORTANT: Keep the array in MIDI 0-127 index order.
export const noteData: note[] = [
    {
      octave: -2,
      note: "C",
      midi: 0
    },
    {
      octave: -2,
      note: "C#",
      midi: 1
    },
    {
      octave: -2,
      note: "D",
      midi: 2
    },
    {
      octave: -2,
      note: "D#",
      midi: 3
    },
    {
      octave: -2,
      note: "E",
      midi: 4
    },
    {
      octave: -2,
      note: "F",
      midi: 5
    },
    {
      octave: -2,
      note: "F#",
      midi: 6
    },
    {
      octave: -2,
      note: "G",
      midi: 7
    },
    {
      octave: -2,
      note: "G#",
      midi: 8
    },
    {
      octave: -2,
      note: "A",
      midi: 9
    },
    {
      octave: -2,
      note: "A#",
      midi: 10
    },
    {
      octave: -2,
      note: "B",
      midi: 11
    },
    {
      octave: -1,
      note: "C",
      midi: 12
    },
    {
      octave: -1,
      note: "C#",
      midi: 13
    },
    {
      octave: -1,
      note: "D",
      midi: 14
    },
    {
      octave: -1,
      note: "D#",
      midi: 15
    },
    {
      octave: -1,
      note: "E",
      midi: 16
    },
    {
      octave: -1,
      note: "F",
      midi: 17
    },
    {
      octave: -1,
      note: "F#",
      midi: 18
    },
    {
      octave: -1,
      note: "G",
      midi: 19
    },
    {
      octave: -1,
      note: "G#",
      midi: 20
    },
    {
      octave: -1,
      note: "A",
      midi: 21
    },
    {
      octave: -1,
      note: "A#",
      midi: 22
    },
    {
      octave: -1,
      note: "B",
      midi: 23
    },
    {
      octave: 0,
      note: "C",
      midi: 24
    },
    {
      octave: 0,
      note: "C#",
      midi: 25
    },
    {
      octave: 0,
      note: "D",
      midi: 26
    },
    {
      octave: 0,
      note: "D#",
      midi: 27
    },
    {
      octave: 0,
      note: "E",
      midi: 28
    },
    {
      octave: 0,
      note: "F",
      midi: 29
    },
    {
      octave: 0,
      note: "F#",
      midi: 30
    },
    {
      octave: 0,
      note: "G",
      midi: 31
    },
    {
      octave: 0,
      note: "G#",
      midi: 32
    },
    {
      octave: 0,
      note: "A",
      midi: 33
    },
    {
      octave: 0,
      note: "A#",
      midi: 34
    },
    {
      octave: 0,
      note: "B",
      midi: 35
    },
    {
      octave: 1,
      note: "C",
      midi: 36
    },
    {
      octave: 1,
      note: "C#",
      midi: 37
    },
    {
      octave: 1,
      note: "D",
      midi: 38
    },
    {
      octave: 1,
      note: "D#",
      midi: 39
    },
    {
      octave: 1,
      note: "E",
      midi: 40
    },
    {
      octave: 1,
      note: "F",
      midi: 41
    },
    {
      octave: 1,
      note: "F#",
      midi: 42
    },
    {
      octave: 1,
      note: "G",
      midi: 43
    },
    {
      octave: 1,
      note: "G#",
      midi: 44
    },
    {
      octave: 1,
      note: "A",
      midi: 45
    },
    {
      octave: 1,
      note: "A#",
      midi: 46
    },
    {
      octave: 1,
      note: "B",
      midi: 47
    },
    {
      octave: 2,
      note: "C",
      midi: 48
    },
    {
      octave: 2,
      note: "C#",
      midi: 49
    },
    {
      octave: 2,
      note: "D",
      midi: 50
    },
    {
      octave: 2,
      note: "D#",
      midi: 51
    },
    {
      octave: 2,
      note: "E",
      midi: 52
    },
    {
      octave: 2,
      note: "F",
      midi: 53
    },
    {
      octave: 2,
      note: "F#",
      midi: 54
    },
    {
      octave: 2,
      note: "G",
      midi: 55
    },
    {
      octave: 2,
      note: "G#",
      midi: 56
    },
    {
      octave: 2,
      note: "A",
      midi: 57
    },
    {
      octave: 2,
      note: "A#",
      midi: 58
    },
    {
      octave: 2,
      note: "B",
      midi: 59
    },
    {
      octave: 3,
      note: "C",
      midi: 60
    },
    {
      octave: 3,
      note: "C#",
      midi: 61
    },
    {
      octave: 3,
      note: "D",
      midi: 62
    },
    {
      octave: 3,
      note: "D#",
      midi: 63
    },
    {
      octave: 3,
      note: "E",
      midi: 64
    },
    {
      octave: 3,
      note: "F",
      midi: 65
    },
    {
      octave: 3,
      note: "F#",
      midi: 66
    },
    {
      octave: 3,
      note: "G",
      midi: 67
    },
    {
      octave: 3,
      note: "G#",
      midi: 68
    },
    {
      octave: 3,
      note: "A",
      midi: 69
    },
    {
      octave: 3,
      note: "A#",
      midi: 70
    },
    {
      octave: 3,
      note: "B",
      midi: 71
    },
    {
      octave: 4,
      note: "C",
      midi: 72
    },
    {
      octave: 4,
      note: "C#",
      midi: 73
    },
    {
      octave: 4,
      note: "D",
      midi: 74
    },
    {
      octave: 4,
      note: "D#",
      midi: 75
    },
    {
      octave: 4,
      note: "E",
      midi: 76
    },
    {
      octave: 4,
      note: "F",
      midi: 77
    },
    {
      octave: 4,
      note: "F#",
      midi: 78
    },
    {
      octave: 4,
      note: "G",
      midi: 79
    },
    {
      octave: 4,
      note: "G#",
      midi: 80
    },
    {
      octave: 4,
      note: "A",
      midi: 81
    },
    {
      octave: 4,
      note: "A#",
      midi: 82
    },
    {
      octave: 4,
      note: "B",
      midi: 83
    },
    {
      octave: 5,
      note: "C",
      midi: 84
    },
    {
      octave: 5,
      note: "C#",
      midi: 85
    },
    {
      octave: 5,
      note: "D",
      midi: 86
    },
    {
      octave: 5,
      note: "D#",
      midi: 87
    },
    {
      octave: 5,
      note: "E",
      midi: 88
    },
    {
      octave: 5,
      note: "F",
      midi: 89
    },
    {
      octave: 5,
      note: "F#",
      midi: 90
    },
    {
      octave: 5,
      note: "G",
      midi: 91
    },
    {
      octave: 5,
      note: "G#",
      midi: 92
    },
    {
      octave: 5,
      note: "A",
      midi: 93
    },
    {
      octave: 5,
      note: "A#",
      midi: 94
    },
    {
      octave: 5,
      note: "B",
      midi: 95
    },
    {
      octave: 6,
      note: "C",
      midi: 96
    },
    {
      octave: 6,
      note: "C#",
      midi: 97
    },
    {
      octave: 6,
      note: "D",
      midi: 98
    },
    {
      octave: 6,
      note: "D#",
      midi: 99
    },
    {
      octave: 6,
      note: "E",
      midi: 100
    },
    {
      octave: 6,
      note: "F",
      midi: 101
    },
    {
      octave: 6,
      note: "F#",
      midi: 102
    },
    {
      octave: 6,
      note: "G",
      midi: 103
    },
    {
      octave: 6,
      note: "G#",
      midi: 104
    },
    {
      octave: 6,
      note: "A",
      midi: 105
    },
    {
      octave: 6,
      note: "A#",
      midi: 106
    },
    {
      octave: 6,
      note: "B",
      midi: 107
    },
    {
      octave: 7,
      note: "C",
      midi: 108
    },
    {
      octave: 7,
      note: "C#",
      midi: 109
    },
    {
      octave: 7,
      note: "D",
      midi: 110
    },
    {
      octave: 7,
      note: "D#",
      midi: 111
    },
    {
      octave: 7,
      note: "E",
      midi: 112
    },
    {
      octave: 7,
      note: "F",
      midi: 113
    },
    {
      octave: 7,
      note: "F#",
      midi: 114
    },
    {
      octave: 7,
      note: "G",
      midi: 115
    },
    {
      octave: 7,
      note: "G#",
      midi: 116
    },
    {
      octave: 7,
      note: "A",
      midi: 117
    },
    {
      octave: 7,
      note: "A#",
      midi: 118
    },
    {
      octave: 7,
      note: "B",
      midi: 119
    },
    {
      octave: 8,
      note: "C",
      midi: 120
    },
    {
      octave: 8,
      note: "C#",
      midi: 121
    },
    {
      octave: 8,
      note: "D",
      midi: 122
    },
    {
      octave: 8,
      note: "D#",
      midi: 123
    },
    {
      octave: 8,
      note: "E",
      midi: 124
    },
    {
      octave: 8,
      note: "F",
      midi: 125
    },
    {
      octave: 8,
      note: "F#",
      midi: 126
    },
    {
      octave: 8,
      note: "G",
      midi: 127
    }
]
