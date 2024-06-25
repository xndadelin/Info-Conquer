const validateTurnstile = async(token, req) => {
    const ip = req.ip.split(':').pop()
    let formData = new FormData();
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    formData.append('remoteip', ip);

	  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	  const result = await fetch(url, {
		  body: formData,
		  method: 'POST',
	  });
    const data = await result.json();
    return data;
}
module.exports = {
    validateTurnstile
}