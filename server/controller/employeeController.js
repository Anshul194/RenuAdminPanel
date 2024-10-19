import employeeModel from "../models/Employee.js";
import iccModel from "../models/icc.model.js";
import offerletterModel from "../models/offerletter.model.js";
import LorModel from "../models/lor.model.js";
import pdfGenerator from "../Util/pdfGenerator.js";
import OfferLetterGenerator from "../Util/offerLetterGenerator.js";
import IccGenerator from "../Util/iccGenerator.js";
import StarIntern from "../models/starintern.model.js";
import StarInternGenerator from "../Util/starInternGenerator.js";
import LorGenerator from '../Util/lorGenerator.js';

// Generate Offer Letter
const GenerateOfferLetter = async (req, res) => {
  try {
    const { name, email, post, startDate, endDate, tenure } = req.body;
    // console.log(req.body);
    const pdfBuffer = await OfferLetterGenerator(
      name,
      email,
      post,
      startDate,
      endDate,
      tenure
    );

    const user = await offerletterModel.findOne({ email });
    if (user && user.pdfBuffer) {
      return res.status(200).json({
        message: `Offer letter is already generated for this user: ${name} (${email})`,
      });
    }

    if (user) {
      user.pdfBuffer = pdfBuffer.buffer;
      await user.save();
    } else {
      const offerletter = new offerletterModel({
        ...req.body,
        pdfBuffer: pdfBuffer.buffer,
      });
      await offerletter.save();
    }

    return res
      .status(200)
      .json({ message: "Offer letter generation successful" });
  } catch (err) {
    console.error("Error in GenerateOfferLetter:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const GenerateStarIntern = async (req, res) => {
  try {
    const { name, email, post, duration, certificateName } = req.body;
    console.log("starintern", req.body);

    // Generate the PDF certificate
    const pdfBuffer = await StarInternGenerator(
      name,
      email,
      post,
      duration,
      certificateName
    );

    // Check if the user already exists and has a PDF buffer
    const user = await StarIntern.findOne({ email });
    if (user && user.pdfBuffer) {
      return res.status(200).json({
        message: `Offer letter is already generated for this user: ${name} (${email})`,
      });
    }

    // Update the existing user's PDF buffer or create a new entry
    if (user) {
      user.pdfBuffer = pdfBuffer.buffer;
      await user.save();
    } else {
      const newIntern = new StarIntern({
        ...req.body,
        pdfBuffer: pdfBuffer.buffer,
      });
      await newIntern.save();
    }

    return res
      .status(200)
      .json({ message: "Star Intern generation successful" });
  } catch (err) {
    console.error("Error in GenerateStarIntern:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Generate ICC Letter
const GenerateICC = async (req, res) => {
  try {
    const { name, email, post, startDate, endDate, tenure, certificateName } =
      req.body;
    console.log("Icc");
    console.log(name, email, post, certificateName);
    const pdfBuffer = await IccGenerator(
      name,
      email,
      post,
      startDate,
      endDate,
      tenure,
      certificateName
    );

    const user = await iccModel.findOne({ email });
    if (user && user.pdfBuffer) {
      return res.status(200).json({
        message: `ICC is already generated for this user: ${name} (${email})`,
      });
    }

    if (user) {
      user.pdfBuffer = pdfBuffer.buffer;
      await user.save();
    } else {
      const icc = new iccModel({
        ...req.body,
        pdfBuffer: pdfBuffer.buffer,
      });
      await icc.save();
    }

    return res
      .status(200)
      .json({ message: "ICC letter generation successful" });
  } catch (err) {
    console.error("Error in GenerateICC:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Generate LOR
const GenerateLOR = async (req, res) => {
  try {
    const { name, email, post, certificateName,department } = req.body;
    console.log(name, email, post, certificateName,department);
    const pdfBuffer = await LorGenerator(name, email, post, certificateName,department);

    const user = await LorModel.findOne({ email });
    if (user && user.pdfBuffer) {
      return res.status(200).json({
        message: `LOR is already generated for this user: ${name} (${email})`,
      });
    }

    if (user) {
      user.pdfBuffer = pdfBuffer.buffer;
      await user.save();
    } else {
      const lor = new LorModel({
        ...req.body,
        pdfBuffer: pdfBuffer.buffer,
      });
      await lor.save();
    }

    return res.status(200).json({ message: "LOR generation successful" });
  } catch (err) {
    console.error("Error in GenerateLOR:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Download Offer Letter
const downloadOfferLetter = async (req, res) => {
  try {
    const { email } = req.query;
    const employee = await offerletterModel.findOne({ email });
    if (!employee || !employee.pdfBuffer) {
      return res.status(404).json({ error: "Offer letter not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employee.name}_Offer_Letter.pdf`
    );
    return res.status(200).send(employee.pdfBuffer);
  } catch (err) {
    console.error("Error in downloadOfferLetter:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Download ICC Letter
const downloadICC = async (req, res) => {
  try {
    const { email } = req.query;
    const employee = await iccModel.findOne({ email });
    if (!employee || !employee.pdfBuffer) {
      return res.status(404).json({ error: "ICC not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employee.name}_Internship_Completion_Certificate.pdf`
    );
    return res.status(200).send(employee.pdfBuffer);
  } catch (err) {
    console.error("Error in downloadICC:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Download LOR
const downloadLOR = async (req, res) => {
  try {
    const { email } = req.query;
    const employee = await LorModel.findOne({ email });
    if (!employee || !employee.pdfBuffer) {
      return res.status(404).json({ error: "LOR not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employee.name}_Letter_of_Recommendation.pdf`
    );
    return res.status(200).send(employee.pdfBuffer);
  } catch (err) {
    console.error("Error in downloadLOR:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const downloadStarIntern = async (req, res) => {
  try {
    const { email } = req.query;
  
    const employee = await StarIntern.findOne({ email });
    if (!employee || !employee.pdfBuffer) {
      return res.status(404).json({ error: "LOR not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employee.name}_starIntern.pdf`
    );
    return res.status(200).send(employee.pdfBuffer);
  } catch (err) {
    console.error("Error in downloadLOR:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  GenerateOfferLetter,
  GenerateICC,
  GenerateLOR,
  GenerateStarIntern,
  downloadOfferLetter,
  downloadICC,
  downloadLOR,
  downloadStarIntern,
};
