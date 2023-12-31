export default function cesiumDemoFn() {
    function colorByMaterial() {
        osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
          defines: {
            material: "${feature['building:material']}",
          },
          color: {
            conditions: [
              ["${material} === null", "color('white')"],
              ["${material} === 'glass'", "color('skyblue', 0.5)"],
              ["${material} === 'concrete'", "color('grey')"],
              ["${material} === 'brick'", "color('indianred')"],
              ["${material} === 'stone'", "color('lightslategrey')"],
              ["${material} === 'metal'", "color('lightgrey')"],
              ["${material} === 'steel'", "color('lightsteelblue')"],
              ["true", "color('white')"], // This is the else case
            ],
          },
        });
      }
      
      function highlightAllResidentialBuildings() {
        osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [
              [
                "${feature['building']} === 'apartments' || ${feature['building']} === 'residential'",
                "color('cyan', 0.9)",
              ],
              [true, "color('white')"],
            ],
          },
        });
      }
      
      function showByBuildingType(buildingType) {
        switch (buildingType) {
          case "office":
            osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
              show: "${feature['building']} === 'office'",
            });
            break;
          case "apartments":
            osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
              show: "${feature['building']} === 'apartments'",
            });
            break;
          default:
            break;
        }
      }
      
      // Color the buildings based on their distance from a selected central location
      function colorByDistanceToCoordinate(pickedLatitude, pickedLongitude) {
        osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
          defines: {
            distance: `distance(vec2(\${feature['cesium#longitude']}, \${feature['cesium#latitude']}), vec2(${pickedLongitude},${pickedLatitude}))`,
          },
          color: {
            conditions: [
              ["${distance} > 0.014", "color('blue')"],
              ["${distance} > 0.010", "color('green')"],
              ["${distance} > 0.006", "color('yellow')"],
              ["${distance} > 0.0001", "color('red')"],
              ["true", "color('white')"],
            ],
          },
        });
      }
      
      // When dropdown option is not "Color By Distance To Selected Location",
      // remove the left click input event for selecting a central location
      function removeCoordinatePickingOnLeftClick() {
        document.querySelector(".infoPanel").style.visibility = "hidden";
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      
      // Add event listeners to dropdown menu options
      document.querySelector(".infoPanel").style.visibility = "hidden";
      const menu = document.getElementById("dropdown");
      
      menu.options[0].onselect = function () {
        removeCoordinatePickingOnLeftClick();
        colorByMaterial();
      };
      
      menu.options[1].onselect = function () {
        // Default to Space Needle as the central location
        colorByDistanceToCoordinate(47.62051, -122.34931);
        document.querySelector(".infoPanel").style.visibility = "visible";
        // Add left click input to select a building to and extract its coordinates
        handler.setInputAction(function (movement) {
          viewer.selectedEntity = undefined;
          const pickedBuilding = viewer.scene.pick(movement.position);
          if (pickedBuilding) {
            const pickedLatitude = pickedBuilding.getProperty(
              "cesium#latitude"
            );
            const pickedLongitude = pickedBuilding.getProperty(
              "cesium#longitude"
            );
            colorByDistanceToCoordinate(pickedLatitude, pickedLongitude);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      };
      
      menu.options[2].onselect = function () {
        removeCoordinatePickingOnLeftClick();
        highlightAllResidentialBuildings();
      };
      
      menu.options[3].onselect = function () {
        removeCoordinatePickingOnLeftClick();
        showByBuildingType("office");
      };
      
      menu.options[4].onselect = function () {
        removeCoordinatePickingOnLeftClick();
        showByBuildingType("apartments");
      };
      
      menu.onchange = function () {
        Sandcastle.reset();
        const item = menu.options[menu.selectedIndex];
        if (item && typeof item.onselect === "function") {
          item.onselect();
        }
      };
      
      colorByMaterial(); 
}