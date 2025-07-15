import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const DOC_KEY = process.env.DOC_KEY; // NON scrivere la chiave qui, la prendi da Render!

app.all('/chat/:docid', async (req, res) => {
  const url = `https://api.docanalyzer.ai/api/v1/doc/${req.params.docid}/chat`;
  try {
    const apiRes = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${DOC_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
    });
    const data = await apiRes.text();
    res.status(apiRes.status).send(data);
  } catch (e) {
    res.status(500).send('Proxy error: ' + e.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Proxy listening on port', port));
