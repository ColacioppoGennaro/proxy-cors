process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const DOC_KEY = process.env.DOC_KEY;

app.post('/chat/:docid', async (req, res) => {
  const { docid } = req.params;
  const url = `https://api.docanalyzer.ai/api/v1/doc/${docid}/chat`;
  try {
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DOC_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: req.body.prompt || req.body.query || "Ping di prova",
        adherence: "strict"
      })
    });
    const data = await apiRes.text();
    res.status(apiRes.status).send(data);
  } catch (e) {
    res.status(500).send('Proxy error: ' + e.toString());
  }
});

// Per le immagini (pagina del PDF)
app.get('/page/:docid/:page', async (req, res) => {
  const { docid, page } = req.params;
  const url = `https://api.docanalyzer.ai/api/v1/doc/${docid}/page/${page}`;
  try {
    const apiRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${DOC_KEY}`,
      }
    });
    res.setHeader('Content-Type', 'image/jpeg');
    apiRes.body.pipe(res);
  } catch (e) {
    res.status(500).send('Proxy error: ' + e.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Proxy listening on port', port));
