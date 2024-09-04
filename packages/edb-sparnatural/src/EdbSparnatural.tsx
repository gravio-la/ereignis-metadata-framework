import React, { useEffect, useRef } from 'react';
import "sparnatural/src/assets/stylesheets/sparnatural.scss";

// import the JSON-LD config file
import config from "./config.json"

interface SparnaturalEvent extends Event {
  detail?: {
    queryString: string,
    queryJson: string,
    querySparqlJs: string
  }
}

console.log({ config })
interface EdbSparnaturalProps {
  src: string;
  lang: string;
  endpoint: string;
  distinct: string;
  limit: string;
  prefix: string;
  debug: string;
}

export const EdbSparnatural: React.FC<EdbSparnaturalProps> = ({
  src,
  lang,
  endpoint,
  distinct,
  limit,
  prefix,
  debug,
}) => {
  const sparnaturalRef = useRef<HTMLElement>(null);

  useEffect(() => {

    //import "sparnatural";
    //
    import("sparnatural").then(() => {
      const handleQueryUpdated = (event: SparnaturalEvent) => {
        console.log(event?.detail?.queryString);
        console.log(event?.detail?.queryJson);
        console.log(event?.detail?.querySparqlJs);
        // here : don't forget to call expandSparql so that core:sparqlString annotation is taken into account
      };

      sparnaturalRef.current?.addEventListener("queryUpdated", handleQueryUpdated);

      // Cleanup the event listener on component unmount
      return () => {
        sparnaturalRef.current?.removeEventListener("queryUpdated", handleQueryUpdated);
      };
    });
  }, []);

  return (
    <div className="App">
      {/*FontAwesome is only needed when the fontawesome features is used to display icons*/}
      <div id="ui-search" style={{ width: "auto" }}>
        <spar-natural
          ref={sparnaturalRef}
          src={src}
          lang={lang}
          endpoint={endpoint}
          distinct={distinct}
          limit={limit}
          prefix={prefix}
          debug={debug}
        />
      </div>
    </div>
  );
};

