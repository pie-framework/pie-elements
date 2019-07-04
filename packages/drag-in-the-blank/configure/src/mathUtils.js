const loadXMLDoc = filename => {
  const xhttp = new XMLHttpRequest();

  xhttp.open('GET', filename, false);

  try {
    xhttp.responseType = 'msxml-document';
  } catch (err) {
  } // Helping IE11

  xhttp.send('');

  return xhttp.responseXML;
};

const displayResult = () => {
  const xsl = loadXMLDoc('cdcatalog_client.xsl');

  const xsltProcessor = new XSLTProcessor();

  xsltProcessor.importStylesheet(xsl);
  xsltProcessor.transformToDocument(document);
};

export default {
  loadXMLDoc,
  displayResult
}
