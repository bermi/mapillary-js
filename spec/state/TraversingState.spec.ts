/// <reference path="../../typings/index.d.ts" />

import * as THREE from "three";

import {IAPINavImIm} from "../../src/API";
import {Camera} from "../../src/Geo";
import {Node} from "../../src/Graph";
import {IState, TraversingState} from "../../src/State";

describe("TraversingState.ctor", () => {
    it("should be defined", () => {
        let state: IState = {
            alpha: 1,
            camera: new Camera(),
            currentIndex: -1,
            reference: { alt: 0, lat: 0, lon: 0 },
            trajectory: [],
            zoom: 0,
        };

        let traversingState: TraversingState = new TraversingState(state);

        expect(traversingState).toBeDefined();
    });
});

class TestTraversingState extends TraversingState {
    public get currentCamera(): Camera {
        return this._currentCamera;
    }

    public get previousCamera(): Camera {
        return this._previousCamera;
    }
}

class TestNode extends Node {
    public get loaded(): boolean {
        return true;
    }
}

describe("TraversingState.currentCamera.lookat", () => {
    let precision: number = 1e-8;

    it("should correspond to set node", () => {
        let camera: Camera = new Camera();
        camera.position.fromArray([10, 10, 0]);
        camera.lookat.fromArray([15, 15, 0]);

        let state: IState = {
            alpha: 1,
            camera: camera,
            currentIndex: -1,
            reference: { alt: 0, lat: 0, lon: 0 },
            trajectory: [],
            zoom: 0,
        };

        let traversingState: TestTraversingState = new TestTraversingState(state);

        let apiNavImIm: IAPINavImIm = { calt: 0, key: "", rotation: [0, 0, 0] };
        let node: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, apiNavImIm, null);

        traversingState.set([node]);

        expect(traversingState.currentCamera.position.x).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.position.y).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.position.z).toBeCloseTo(0, precision);

        expect(traversingState.currentCamera.lookat.x).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.lookat.y).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.lookat.z).toBeGreaterThan(0);
    });

    it("should correspond to set nodes", () => {
        let camera: Camera = new Camera();
        camera.position.fromArray([10, 10, 0]);
        camera.lookat.fromArray([15, 15, 0]);

        let state: IState = {
            alpha: 1,
            camera: camera,
            currentIndex: -1,
            reference: { alt: 0, lat: 0, lon: 0 },
            trajectory: [],
            zoom: 0,
        };

        let traversingState: TestTraversingState = new TestTraversingState(state);

        let previousApiNavImIm: IAPINavImIm = { calt: 0, key: "", rotation: [Math.PI, 0, 0] };
        let previousNode: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, previousApiNavImIm, null);

        let currentApiNavImIm: IAPINavImIm = { calt: 0, key: "", rotation: [0, 0, 0] };
        let currentNode: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, currentApiNavImIm, null);

        traversingState.set([previousNode]);
        traversingState.set([currentNode]);

        expect(traversingState.currentCamera.position.x).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.position.y).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.position.z).toBeCloseTo(0, precision);

        expect(traversingState.currentCamera.lookat.x).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.lookat.y).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.lookat.z).toBeGreaterThan(0);
    });

    it("should correspond to lookat of camera when full pano", () => {
        let camera: Camera = new Camera();
        camera.position.fromArray([10, 10, 0]);
        camera.lookat.fromArray([15, 15, 0]);

        let state: IState = {
            alpha: 1,
            camera: camera,
            currentIndex: -1,
            reference: { alt: 0, lat: 0, lon: 0 },
            trajectory: [],
            zoom: 0,
        };

        let traversingState: TestTraversingState = new TestTraversingState(state);

        let previousApiNavImIm: IAPINavImIm = { calt: 0, key: "", rotation: [Math.PI, 0, 0] };
        let previousNode: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, previousApiNavImIm, null);

        let currentApiNavImIm: IAPINavImIm = {
            calt: 0,
            gpano: {
                CroppedAreaImageHeightPixels: 1,
                CroppedAreaImageWidthPixels: 1,
                CroppedAreaLeftPixels: 0,
                CroppedAreaTopPixels: 0,
                FullPanoHeightPixels: 1,
                FullPanoWidthPixels: 1,
            },
            key: "",
            rotation: [0, 0, 0],
        };

        let currentNode: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, currentApiNavImIm, null);

        traversingState.set([previousNode]);
        traversingState.set([currentNode]);

        expect(traversingState.currentCamera.position.x).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.position.y).toBeCloseTo(0, precision);
        expect(traversingState.currentCamera.position.z).toBeCloseTo(0, precision);

        let lookat: THREE.Vector3 = camera.lookat.clone().sub(camera.position);

        expect(traversingState.currentCamera.lookat.x).toBeCloseTo(lookat.x, precision);
        expect(traversingState.currentCamera.lookat.y).toBeCloseTo(lookat.y, precision);
        expect(traversingState.currentCamera.lookat.z).toBeCloseTo(lookat.z, precision);
    });
});

describe("TraversingState.previousCamera.lookat", () => {
    let precision: number = 1e-8;

    it("should correspond to current node camera when previous node not set", () => {
        let camera: Camera = new Camera();
        camera.position.fromArray([10, 10, 0]);
        camera.lookat.fromArray([15, 15, 0]);

        let state: IState = {
            alpha: 1,
            camera: camera,
            currentIndex: -1,
            reference: { alt: 0, lat: 0, lon: 0 },
            trajectory: [],
            zoom: 0,
        };

        let traversingState: TestTraversingState = new TestTraversingState(state);

        let apiNavImIm: IAPINavImIm = { calt: 0, key: "", rotation: [0, 0, 0] };
        let node: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, apiNavImIm, null);

        traversingState.set([node]);

        expect(traversingState.previousCamera.position.x).toBeCloseTo(0, precision);
        expect(traversingState.previousCamera.position.y).toBeCloseTo(0, precision);
        expect(traversingState.previousCamera.position.z).toBeCloseTo(0, precision);

        expect(traversingState.previousCamera.lookat.x).toBeCloseTo(0, precision);
        expect(traversingState.previousCamera.lookat.y).toBeCloseTo(0, precision);
        expect(traversingState.previousCamera.lookat.z).toBeGreaterThan(0);
    });

    it("should correspond to camera when previous node set", () => {
        let camera: Camera = new Camera();
        camera.position.fromArray([10, 10, 0]);
        camera.lookat.fromArray([15, 15, 0]);

        let state: IState = {
            alpha: 1,
            camera: camera,
            currentIndex: -1,
            reference: { alt: 0, lat: 0, lon: 0 },
            trajectory: [],
            zoom: 0,
        };

        let traversingState: TestTraversingState = new TestTraversingState(state);

        let previousApiNavImIm: IAPINavImIm = { calt: 0, key: "", rotation: [Math.PI, 0, 0] };
        let previousNode: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, previousApiNavImIm, null);

        let currentApiNavImIm: IAPINavImIm = { calt: 0, key: "", rotation: [0, 0, 0] };

        let currentNode: TestNode = new TestNode(0, {lat: 0, lon: 0}, true, null, currentApiNavImIm, null);

        traversingState.set([previousNode]);
        traversingState.set([currentNode]);

        expect(traversingState.previousCamera.position.x).toBeCloseTo(0, precision);
        expect(traversingState.previousCamera.position.y).toBeCloseTo(0, precision);
        expect(traversingState.previousCamera.position.z).toBeCloseTo(0, precision);

        let lookat: THREE.Vector3 = camera.lookat.clone().sub(camera.position);

        expect(traversingState.previousCamera.lookat.x).toBeCloseTo(lookat.x, precision);
        expect(traversingState.previousCamera.lookat.y).toBeCloseTo(lookat.y, precision);
        expect(traversingState.previousCamera.lookat.z).toBeCloseTo(lookat.z, precision);
    });
});
