import moment from 'moment';

export const getTime = solve => {
    if (!solve) {
        return 0;
    }
    if (solve.penalty) {
        return solve.time + 2;
    }
    return solve.time;
};

export const sortByCreatedAt = array => {
    return [...array].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB;
    });
};

export const solvesByDay = session => {
    if (session.length === 0) {
        return [];
    }
    const sortedSession = sortByCreatedAt(session);

    const startDate = new Date(sortedSession[0].createdAt);
    const endDate = new Date(sortedSession[sortedSession.length - 1].createdAt);

    let counter = 0;
    let dayStart = moment();
    let dayEnd = moment();

    const byDay = [];

    do {
        dayStart = moment(startDate)
            .add(counter, 'days')
            .startOf('day');
        dayEnd = moment(startDate)
            .add(counter, 'days')
            .endOf('day');

        const solvesOfTheDay = session.filter(a => {
            const solveDate = moment(a.createdAt);
            return solveDate.isBetween(dayStart, dayEnd);
        });

        if (solvesOfTheDay.length > 0) {
            byDay.push(solvesOfTheDay);
        }

        counter++;
    } while (dayEnd.isBefore(endDate));

    return byDay;
};

export const averageOfN = (solves, n = 5) => {
    if (solves.length === 0) {
        return 0;
    }

    let countingSolves = [...solves];
    if (solves.length === n) {
        countingSolves = [...solves].sort((a, b) => getTime(a) - getTime(b)).slice(1, n - 1);
    }

    return countingSolves
        .reduce((accumulator, current, _, array) => {
            return accumulator + getTime(current) / array.length;
        }, 0)
        .toFixed(2);
};

export const lastAverageOfN = (solves, n = 5) => {
    if (solves.length < 5) {
        return 0;
    }

    return averageOfN(solves.slice(-n), n);
};

export const firstAoNByDay = (solves, n = 5) => {
    const byDay = solvesByDay(solves);

    const results = [];
    byDay.forEach(group => {
        if (group.length >= n) {
            const sortedGroup = sortByCreatedAt(group);
            results.push({
                id: `AO${n}-DAY-${sortedGroup[n - 1].id}`,
                average: averageOfN(sortedGroup.slice(0, n), n),
                createdAt: moment(sortedGroup[n - 1].createdAt)
                    .startOf('day')
                    .toISOString(),
            });
        }
    });

    return results;
};

export const rollingAoN = (solves, n = 5) => {
    const sortedSolves = sortByCreatedAt(solves);

    const results = [];
    for (let i = 0; i < sortedSolves.length - (n - 1); i++) {
        results.push({
            id: `AO${n}-${sortedSolves[i + n - 1].id}`,
            average: averageOfN(sortedSolves.slice(i, i + n), n),
            createdAt: sortedSolves[i + n - 1].createdAt,
        });
    }

    return results;
};

export const bestSingle = solves => {
    return [...solves].sort((a, b) => getTime(a) - getTime(b))[0];
};

export const bestRollingAoN = (solves, n = 5) => {
    const averages = rollingAoN(solves, n);
    return [...averages].sort((a, b) => a.average - b.average)[0];
};

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
