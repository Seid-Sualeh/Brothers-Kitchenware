const installService = require("../services/install.service");

async function install(req, res, next) {
  try {
    const installMessage = await installService.install();
    if (installMessage.status === 200) {
      return res.status(200).json({ message: installMessage });
    }
    return res.status(500).json({ message: installMessage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: { status: 500, error: error.message } });
  }
}

module.exports = { install };
