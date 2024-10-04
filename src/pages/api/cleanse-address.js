export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { streetNumber, streetName, city, state, zipCode } = req.body;
    const queryParams = new URLSearchParams({
        'auth-id': process.env.SMARTY_AUTH_ID,
        'auth-token': process.env.SMARTY_AUTH_TOKEN,
        'license': 'us-core-cloud',
        'street': `${streetNumber} ${streetName}`,
        'city': city,
        'state': state,
        'zipcode': zipCode,
      });

    const url = `https://us-street.api.smartystreets.com/street-address?${queryParams.toString()}`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'localhost:3000',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Smarty API Error:', errorText);
        throw new Error('Failed to cleanse address');
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      console.error('Server Error:', err);
      res.status(500).json({ error: err.message });
    }
  }