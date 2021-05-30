/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
    transform: {
        ...tsjPreset.transform,
    },
    preset: '@shelf/jest-mongodb',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/config/*.ts',
        '!<rootDir>/src/app/server.ts',
        '!<rootDir>/src/app/express/logger/*.ts',
    ],
};
