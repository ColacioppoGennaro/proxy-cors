// --- AGGIUNGI QUESTA RIGA IN CIMA ---
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// --- TUTTO IL RESTO ---
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const DOC_KEY = process.env.DOC_KEY; // NON scrivere la chiave qui, la metterai su Render!

app.all('*', async (req, res) => {
  const url = 'https://api.docanalyzer.ai' + req.originalUrl;
  try {
    const apiRes = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        'x-api-key': DOC_KEY,
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });
    const data = await apiRes.text();
    res.status(apiRes.status).send(data);
  } catch (e) {
    res.status(500).send('Proxy error: ' + e.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Proxy listening on port', port));
