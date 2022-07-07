/* eslint-disable no-restricted-globals */
import React from "react";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { SharedMap, Sequence } from "fluid-framework";
import "./App.css";

const getFluidData = async () => {
  // Configure Container
  const client = new TinyliciousClient();
  const containerSchema = { initialObjects: { sharedCursors: SharedMap } };

  // Get the container from the fluid service
  let container;
  const containerId = location.hash.substring(1);
  if (!containerId) {
    ({ container } = await client.createContainer(containerSchema));
    const id = await container.attach();
    location.hash = id;
  } else {
    ({ container } = await client.getContainer(containerId, containerSchema));
  }

  return container.initialObjects;
};

const getFakeName = async () => {
  const res = await fetch('https://api.namefake.com');
  const { name } = await res.json;
  return name;
}

function App() {
  const [fluidSharedObjects, setFluidSharedObjects] = React.useState();
  const [cursors, setCursors] = React.useState();

  React.useEffect(() => {
    getFluidData().then((data) => setFluidSharedObjects(data));
  }, []);

  React.useEffect(() => {
    if (fluidSharedObjects) {
      console.log(fluidSharedObjects.sharedCursors.get('data'));
      const { sharedCursors } = fluidSharedObjects;
      const updateCursors = () =>
        setCursors({ time: sharedCursors.get("data") });

      updateLocalTimestamp();

      sharedCursors.on("valueChanged", updateCursors);

      return () => {
        sharedCursors.off("valueChanged", updateCursors);
      };
    } else {
    }
  }, [fluidSharedObjects]);

  if (cursors) {
    return (
      <div className="main">
      </div>
    );
  } else {
    return <div />;
  }
}

export default App;
