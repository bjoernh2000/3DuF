import Template from "./template";
import paper from "paper";

export default class SquareCellTrap extends Template {
    constructor() {
        super();
    }

    __setupDefinitions() {
        this.__unique = {
            position: "Point"
        };

        this.__heritable = {
            channelWidth: "Float",
            chamberWidth: "Float",
            chamberLength: "Float",
            height: "Float",
            rotation: "Float"
        };

        this.__defaults = {
            chamberLength: 1.2 * 1000,
            channelWidth: 0.41 * 1000,
            chamberWidth: 1.23 * 1000,
            height: 250,
            rotation: 0
        };

        this.__units = {
            chamberLength: "&mu;m",
            channelWidth: "&mu;m",
            chamberWidth: "&mu;m",
            height: "&mu;m",
            rotation: "&deg;"
        };

        this.__minimum = {
            chamberLength: 30,
            cannelWidth: 10,
            chamberWidth: 30,
            height: 10,
            rotation: 0
        };

        this.__maximum = {
            chamberLength: 6000,
            channelWidth: 2000,
            chamberWidth: 6000,
            height: 1200,
            rotation: 360
        };

        this.__featureParams = {
            position: "position",
            chamberWidth: "chamberWidth",
            chamberLength: "chamberLength",
            channelWidth: "channelWidth",
            height: "height",
            rotation: "rotation"
        };

        this.__targetParams = {
            chamberWidth: "chamberWidth",
            chamberLength: "chamberLength",
            channelWidth: "feedingChannelWidth",
            height: "height",
            rotation: "rotation"
        };

        this.__placementTool = "CellPositionTool";

        this.__toolParams = {
            position: "position"
        };

        this.__renderKeys = ["FLOW", "CELL"];

        this.__mint = "SQUARE CELL TRAP";
    }

    render2D(params, key="FLOW") {
        if (key == "FLOW") {
            return this.__drawFlow(params);
        } else if (key == "CELL") {
            return this.__drawCell(params);
        }
    }

    render2DTarget(key, params) {
        let position = params["position"];
        let chamberLength = params["chamberLength"];
        let chamberWidth = params["chamberWidth"];
        let feedingChannelWidth = params["channelWidth"];
        let color = params["color"];
        let x = position[0];
        let y = position[1];

        let chamberList = [];
        let rec;
        let traps;
        let channels;

        if (orientation == "V") {
            for (let i = 0; i < numChambers / 2; i++) {
                rec = paper.Path.Rectangle({
                    size: [2 * chamberLength + feedingChannelWidth, chamberWidth],
                    point: [x, y + i * (chamberWidth + chamberSpacing) + chamberSpacing],
                    fillColor: color,
                    strokeWidth: 0
                });
                chamberList.push(rec);
            }
            channels = paper.Path.Rectangle({
                point: [x + chamberLength, y],
                size: [feedingChannelWidth, (numChambers / 2) * (chamberWidth + chamberSpacing) + chamberSpacing],
                fillColor: color,
                strokeWidth: 0
            });
            chamberList.push(channels);
        } else {
            for (let i = 0; i < numChambers / 2; i++) {
                rec = paper.Path.Rectangle({
                    size: [chamberWidth, 2 * chamberLength + feedingChannelWidth],
                    point: [x + i * (chamberWidth + chamberSpacing) + chamberSpacing, y],
                    fillColor: color,
                    strokeWidth: 0
                });
                chamberList.push(rec);
            }
            channels = paper.Path.Rectangle({
                point: [x, y + chamberLength],
                size: [(numChambers / 2) * (chamberWidth + chamberSpacing) + chamberSpacing, feedingChannelWidth],
                fillColor: color,
                strokeWidth: 0
            });
            chamberList.push(channels);
        }
        traps = new paper.CompoundPath(chamberList);
        traps.fillColor = color;
        traps.fillColor.alpha = 0.5;
        return traps;
    }

    __drawFlow(params) {
        let position = params["position"];
        let chamberLength = params["chamberLength"];
        let chamberWidth = params["chamberWidth"];
        let feedingChannelWidth = params["channelWidth"];
        let color = params["color"];

        // console.log(orientation, position, chamberLength, numChambers, chamberWidth, feedingChannelWidth, chamberSpacing);
        let x = position[0];
        let y = position[1];
        let chamberList = new paper.CompoundPath();
        chamberList.fillColor = color;
        let rec;
        let traps;
        let channels;
        let startPoint = new paper.Point(x + chamberLength, y);
        channels = new paper.Path.Rectangle({
            point: startPoint,
            size: [feedingChannelWidth, feedingChannelWidth],
            fillColor: color,
            strokeWidth: 0
        });
        chamberList.addChild(channels);
        chamberList.fillColor = color;
        let center = new paper.Point(position[0], position[1]);
        return chamberList.rotate(rotation, center);
    }

    __drawCell(params) {
        let position = params["position"];
        let chamberLength = params["chamberLength"];
        let chamberWidth = params["chamberWidth"];
        let feedingChannelWidth = params["channelWidth"];
        let rotation = params["rotation"];
        let color = params["color"];
        let x = position[0];
        let y = position[1];
        let chamberList = new paper.CompoundPath();
        let rec;
        //finish the drawing code
        chamberList.fillColor = color;
        let center = new paper.Point(x, y);
        return chamberList.rotate(rotation, center);
    }
}
