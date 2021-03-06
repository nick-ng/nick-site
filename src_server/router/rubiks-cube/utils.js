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

const scrambleToWide = scrambleString => {
    let scramble = scrambleString.split(' ');

    const wideScramble = [];
    for (let i = 0; i < scramble.length; i++) {
        if ([2, 3, 5, 7, 11].includes(i)) {
            const { move, rotation } = moveToWide(scramble[i]);
            wideScramble.push(move);
            scramble = rotateScramble(scramble, rotation);
        } else {
            wideScramble.push(scramble[i]);
        }
    }

    return wideScramble.join(' ');
};

module.exports = {
    scrambleToWide,
};
