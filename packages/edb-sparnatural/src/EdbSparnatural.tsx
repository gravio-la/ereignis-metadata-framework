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
export const EdbSparnatural: React.FC = () => {
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
          src={'https://sparnatural.eu/demos/demo-dbpedia-v2/sparnatural-config.ttl'}
          lang="en"
          endpoint="https://fr.dbpedia.org/sparql"
          distinct="true"
          limit="100"
          prefix="skos:http://www.w3.org/2004/02/skos/core# rico:https://www.ica.org/standards/RiC/ontology#"
          debug="true"
        />
      </div>
    </div>
  );
};

