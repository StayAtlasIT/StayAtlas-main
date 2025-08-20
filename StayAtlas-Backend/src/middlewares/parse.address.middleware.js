export const parseAddressBody = (req, res, next) => {
    if (typeof req.body.address === 'string') {
      try {
        req.body.address = JSON.parse(req.body.address);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON in address' });
      }
    }
    next();
  };