import fetch from 'node-fetch';
    import * as fs from 'node:fs/promises';

    const domains = [
      "affinitylove.eu",
      "dropshippingstores.net",
      "aiforbusinesses.org",
      "beautyproductreviews.net",
      "fixie.run",
      "cryptostocksinsider.net",
      "healthylivingadvices.com",
      "devtehen.xyz",
      "techbuzzinga.com"
    ];

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

    async function fetchWithRetry(url, options = {}, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          if (i < retries - 1) {
            console.log(`Retrying ${url}... (${i + 1})`);
            await new Promise(res => setTimeout(res, 1000));
          } else {
            console.error(`Max retries reached for ${url}. Error:`, error);
            throw error;
          }
        }
      }
    }

    async function generateContent(domain) {
      try {
        const response = await fetchWithRetry("https://api.perplexity.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${perplexityApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "mistral-7b-instruct-v0.1",
            messages: [{ role: "user", content: `Generate WordPress content related to ${domain}` }]
          })
        });

        await fs.writeFile(`./content/${domain}.txt`, response.choices[0].message.content);
        console.log(`Content generated for ${domain}`);

      } catch (error) {
        console.error(`Error generating content for ${domain}:`, error);
      }
    }

    // ... (setup and main functions remain the same)
