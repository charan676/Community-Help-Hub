const geminiService = require('../services/gemini.service');

exports.askChatbot = async (req, res, next) => {
  try {
    const { message, location, preferredLanguage } = req.body;

    if (!message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Message is required'
      });
    }

    const reply = await geminiService.processChatQuery(
      message, 
      location, 
      preferredLanguage || (req.user ? req.user.preferredLanguage : 'en')
    );

    res.status(200).json({
      status: 'success',
      data: { reply }
    });
  } catch (error) {
    next(error);
  }
};
