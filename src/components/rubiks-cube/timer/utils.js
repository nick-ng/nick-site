const getMoveMap = rotation => {
    const moveMap = {
        U: 'U',
        L: 'L',
        F: 'F',
        R: 'R',
        B: 'B',
        D: 'D',
    };
    switch (rotation) {
        case 'x':
            moveMap.U = 'B';
            moveMap.F = 'U';
            moveMap.D = 'F';
            moveMap.B = 'D';
            return moveMap;
        case "x'":
            moveMap.U = 'F';
            moveMap.F = 'D';
            moveMap.D = 'B';
            moveMap.B = 'U';
            return moveMap;
        case 'x2':
            moveMap.U = 'D';
            moveMap.F = 'B';
            moveMap.D = 'U';
            moveMap.B = 'F';
            return moveMap;
        case 'y':
            moveMap.L = 'B';
            moveMap.F = 'L';
            moveMap.R = 'F';
            moveMap.B = 'R';
            return moveMap;
        case "y'":
            moveMap.L = 'F';
            moveMap.F = 'R';
            moveMap.R = 'B';
            moveMap.B = 'L';
            return moveMap;
        case 'y2':
            moveMap.L = 'R';
            moveMap.F = 'B';
            moveMap.R = 'L';
            moveMap.B = 'F';
            return moveMap;
        case 'z':
            moveMap.U = 'R';
            moveMap.L = 'U';
            moveMap.R = 'D';
            moveMap.D = 'L';
            return moveMap;
        case "z'":
            moveMap.U = 'L';
            moveMap.L = 'D';
            moveMap.R = 'U';
            moveMap.D = 'R';
            return moveMap;
        case 'z2':
            moveMap.U = 'D';
            moveMap.L = 'R';
            moveMap.R = 'L';
            moveMap.D = 'U';
            return moveMap;
        default:
    }
    return moveMap;
};

const rotateScramble = (scramble, rotation) => {
    const moveMap = getMoveMap(rotation);
    return scramble.map(move => `${moveMap[move[0]]}${move.slice(1)}`);
};

const moveToWide = move => {
    const toWideMap = {
        U: {
            wide: 'Dw',
            rotation: "y'",
        },
        L: {
            wide: 'Rw',
            rotation: 'x',
        },
        F: {
            wide: 'Bw',
            rotation: "z'",
        },
        R: {
            wide: 'Lw',
            rotation: "x'",
        },
        B: {
            wide: 'Fw',
            rotation: 'z',
        },
        D: {
            wide: 'Uw',
            rotation: 'y',
        },
    };

    const newMove = `${toWideMap[move[0]].wide}${move.slice(1)}`;
    const rotation = `${toWideMap[move[0]].rotation}${move.slice(1)}`
        .replace("''", '')
        .replace("'2", '2');
    return {
        move: newMove,
        rotation,
    };
};

const rotateColors = (faceMap, rotation) => {
    const newFaceMap = {
        ...faceMap,
    };
    switch (rotation) {
        case 'x':
            newFaceMap.U = faceMap.B;
            newFaceMap.F = faceMap.U;
            newFaceMap.D = faceMap.F;
            newFaceMap.B = faceMap.D;
            return newFaceMap;
        case "x'":
            newFaceMap.U = faceMap.F;
            newFaceMap.F = faceMap.D;
            newFaceMap.D = faceMap.B;
            newFaceMap.B = faceMap.U;
            return newFaceMap;
        case 'x2':
            newFaceMap.U = faceMap.D;
            newFaceMap.F = faceMap.B;
            newFaceMap.D = faceMap.U;
            newFaceMap.B = faceMap.F;
            return newFaceMap;
        case 'y':
            newFaceMap.L = faceMap.B;
            newFaceMap.F = faceMap.L;
            newFaceMap.R = faceMap.F;
            newFaceMap.B = faceMap.R;
            return newFaceMap;
        case "y'":
            newFaceMap.L = faceMap.F;
            newFaceMap.F = faceMap.R;
            newFaceMap.R = faceMap.B;
            newFaceMap.B = faceMap.L;
            return newFaceMap;
        case 'y2':
            newFaceMap.L = faceMap.R;
            newFaceMap.F = faceMap.B;
            newFaceMap.R = faceMap.L;
            newFaceMap.B = faceMap.F;
            return newFaceMap;
        case 'z':
            newFaceMap.U = faceMap.R;
            newFaceMap.L = faceMap.U;
            newFaceMap.R = faceMap.D;
            newFaceMap.D = faceMap.L;
            return newFaceMap;
        case "z'":
            newFaceMap.U = faceMap.L;
            newFaceMap.L = faceMap.D;
            newFaceMap.R = faceMap.U;
            newFaceMap.D = faceMap.R;
            return newFaceMap;
        case 'z2':
            newFaceMap.U = faceMap.D;
            newFaceMap.L = faceMap.R;
            newFaceMap.R = faceMap.L;
            newFaceMap.D = faceMap.U;
            return newFaceMap;
        default:
    }
    return newFaceMap;
};

export const scrambleToWide = scrambleString => {
    let scramble = scrambleString.split(' ');
    let faceMap = {
        U: 'U',
        L: 'L',
        F: 'F',
        R: 'R',
        B: 'B',
        D: 'D',
    };
    const wideScramble = [];
    for (let i = 0; i < scramble.length; i++) {
        if ([2, 3, 5, 7, 11].includes(i)) {
            const { move, rotation } = moveToWide(scramble[i]);
            wideScramble.push(move);
            scramble = rotateScramble(scramble, rotation);
            faceMap = rotateColors(faceMap, rotation);
        } else {
            wideScramble.push(scramble[i]);
        }
    }

    return {
        scramble: wideScramble.join(' '),
        faceMap,
    };
};
