/// <reference path="../../../typings/index.d.ts" />

import {
    EdgeCalculator,
    EdgeCalculatorSettings,
    EdgeCalculatorDirections,
    EdgeDirection,
    IEdge,
} from "../../../src/Edge";
import {Node, Sequence} from "../../../src/Graph";
import {IAPINavImS, IAPINavImIm} from "../../../src/API";

describe("EdgeCalculator.computeSequenceEdges", () => {
    let edgeCalculator: EdgeCalculator;
    let settings: EdgeCalculatorSettings;
    let directions: EdgeCalculatorDirections;

    let createNode: (key: string, keys: string[]) => Node =
        (key: string, keys: string[]): Node => {
            let apiNavImS: IAPINavImS = { key: "skey", keys: keys };
            let sequence: Sequence = new Sequence(apiNavImS);

            let apiNavImIm: IAPINavImIm = { key: key };

            let node: Node = new Node(0, {lat: 0, lon: 0}, true, sequence, apiNavImIm, []);

            return node;
        };

    beforeEach(() => {
        settings = new EdgeCalculatorSettings();
        directions = new EdgeCalculatorDirections();

        edgeCalculator = new EdgeCalculator(settings, directions);
    });

    it("should return a next edge", () => {
        let key: string = "key";
        let nextKey: string = "nextKey";

        let node: Node = createNode(key, [key, nextKey]);

        let sequenceEdges: IEdge[] = edgeCalculator.computeSequenceEdges(node);

        expect(sequenceEdges.length).toBe(1);

        let sequenceEdge: IEdge = sequenceEdges[0];

        expect(sequenceEdge.to).toBe(nextKey);
        expect(sequenceEdge.data.direction).toBe(EdgeDirection.Next);
    });

    it("should return a prev edge", () => {
        let key: string = "key";
        let prevKey: string = "prevKey";

        let node: Node = createNode(key, [prevKey, key]);

        let sequenceEdges: IEdge[] = edgeCalculator.computeSequenceEdges(node);

        expect(sequenceEdges.length).toBe(1);

        let sequenceEdge: IEdge = sequenceEdges[0];

        expect(sequenceEdge.to).toBe(prevKey);
        expect(sequenceEdge.data.direction).toBe(EdgeDirection.Prev);
    });

    it("should return a prev and a next edge", () => {
        let key: string = "key";
        let prevKey: string = "prevKey";
        let nextKey: string = "nextKey";

        let node: Node = createNode(key, [prevKey, key, nextKey]);

        let sequenceEdges: IEdge[] = edgeCalculator.computeSequenceEdges(node);

        expect(sequenceEdges.length).toBe(2);

        for (let sequenceEdge of sequenceEdges) {
            if (sequenceEdge.to === prevKey) {
                expect(sequenceEdge.data.direction).toBe(EdgeDirection.Prev);
            } else if (sequenceEdge.to === nextKey) {
                expect(sequenceEdge.data.direction).toBe(EdgeDirection.Next);
            }
        }
    });
});
