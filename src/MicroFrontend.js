import React, { useEffect } from "react";

function MicroFrontend({ name, host, history }) {
  const [counter, setCounter] = React.useState(0);
  const counterHandler = () => {
    setCounter(counter + 1);
    console.log(counter)
  }
  useEffect(() => {
    const scriptId = `micro-frontend-script-${name}`;

    const renderMicroFrontend = () => {
      console.log('00')
      window[`render${name}`](`${name}-container`, history);
    };

    if (document.getElementById(scriptId)) {
      renderMicroFrontend();
      return;
    }
    
    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const script = document.createElement("script");
        script.id = scriptId;
        script.crossOrigin = "";
        script.src = `${host}${manifest.files["main.js"]}`;
        script.onload = () => {
          // renderMicroFrontend();
        };
        document.head.appendChild(script);
      });

    return () => {
      window[`unmount${name}`] && window[`unmount${name}`](`${name}-container`);
    };
  });

  return (<div>Counter :{ counter}<button onClick={counterHandler}>Counter</button><main id={`${name}-container`} >  </main></div>);
}

MicroFrontend.defaultProps = {
  document,
  window,
};

export default MicroFrontend;
