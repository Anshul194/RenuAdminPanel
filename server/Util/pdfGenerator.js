import fs from "fs";
import PDFDocument from "pdfkit";
import employeeModel from "../models/Employee.js";

const getCertificateContent = (certificateName, name, post) => {
  const templates = {
    offerletter: {
      subject: `Offer letter of ${post}`,
      mainContent: `We are thrilled to extend an offer of employment for the position of ${post} intern at Renu Sharma Healthcare Education & Foundation. We were impressed by your qualifications and experience, and we believe that you will make a valuable addition to our team.`,
      closingContent: `To accept this offer, please sign and return this letter by 3 days from now. If you have any questions or concerns, please do not hesitate to contact us at `,
      finalMessage:
        "We are excited about the possibility of you joining our team and look forward to your positive response.",
      congratsMessage: "Congratulations!",
      folderPath: "offerletter",
    },
    icc: {
      subject: "Internship Completion Certificate",
      mainContent: `This is to certify that ${name} has successfully completed their internship as a ${post} at Renu Sharma Healthcare Education & Foundation. During the internship period, ${name} demonstrated exceptional performance, professionalism, and dedication to the tasks assigned.`,
      closingContent: `The skills and experience gained during this internship will be valuable for your future career growth. We appreciate your contributions to our organization.`,
      finalMessage: "We wish you all the best in your future endeavors.",
      congratsMessage: "Congratulations on completing your internship!",
      folderPath: "iccCertificate",
    },
    lor: {
      subject: "Letter of Recommendation",
      mainContent: `I am writing to highly recommend ${name}, who worked as a ${post} at Renu Sharma Healthcare Education & Foundation. Throughout their time with us, ${name} has consistently demonstrated exceptional skills, strong work ethic, and outstanding professional conduct.`,
      closingContent: `${name} has proven to be a valuable team member with excellent technical and interpersonal skills. Their dedication and capability to learn and adapt quickly makes them an asset to any organization.`,
      finalMessage:
        "I confidently recommend them for any future opportunities they may pursue.",
      congratsMessage: "Best wishes for your future endeavors!",
      folderPath: "lorCertificate",
    },
  };

  return templates[certificateName.toLowerCase()] || templates.offerletter;
};

const generateCertificate = async (name, email, post, certificateName) => {
  console.log(name, email, post, certificateName);
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    const template = getCertificateContent(certificateName, name, post);
    const certificatePath = `${template.folderPath}/${name}_certificate.pdf`;
    const writeStream = fs.createWriteStream(certificatePath);

    // Pipe the PDF document to buffers array
    doc.on("data", buffers.push.bind(buffers));

    // Pipe the PDF document to write stream to save locally
    doc.pipe(writeStream);

    const backgroundImagePath = "images/logo-image.png";
    const backgroundImage = fs.readFileSync(backgroundImagePath);

    // Define the upper margin
    const upperMargin = 60;

    // Draw the background image with the upper margin
    doc.image(backgroundImage, 0, upperMargin, {
      width: doc.page.width + 2,
      height: doc.page.height - 210,
      opacity: 0.8,
    });
    doc.font("Helvetica");

    // Header
    doc
      .fontSize(20)
      .fillColor("green")
      .font("Helvetica-Bold")
      .text("Renu Sharma Healthcare Education & Foundation", { align: "left" });
    doc.moveDown();

    // Address
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("black")
      .text("Gurugram, Haryana", { align: "left" })
      .text("Sector - 14", { align: "left" })
      .text("Pincode: 122503", { align: "left" })
      .moveDown();

    // Date
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });
    doc.moveDown();

    // Subject
    doc.text(`Subject: ${template.subject}`, { align: "left" });
    doc.moveDown();

    // Salutation
    doc.text(`Dear ${name},`, { align: "left" });
    doc.moveDown();

    // Main content
    doc.text(template.mainContent, { align: "left" });
    doc.moveDown();

    // Closing content
    if (certificateName.toLowerCase() === "offerletter") {
      doc
        .text(template.closingContent, { continued: true })
        .font("Helvetica-Bold")
        .text("9671457366", { continued: true })
        .font("Helvetica")
        .text(" or ", { continued: true })
        .font("Helvetica-Bold")
        .text("Neha.rshefoundation@gmail.com");
    } else {
      doc.text(template.closingContent, { align: "left" });
    }
    doc.moveDown();

    // Final message
    doc.text(template.finalMessage, { align: "left" });
    doc.moveDown();

    // Congratulatory message
    doc.text(template.congratsMessage, { align: "left" });
    doc.moveDown();

    // Name
    doc.text(`Name - ${name}`, { align: "left" });

    // Bottom border
    doc.lineWidth(25);
    doc.strokeColor("#000080");
    doc
      .moveTo(0, doc.page.height - 50)
      .lineTo(doc.page.width, doc.page.height - 50)
      .stroke();

    doc.end();

    writeStream.on("finish", async () => {
      console.log(
        `Certificate generated and stored locally at: ${certificatePath}`
      );
      const pdfBuffer = fs.readFileSync(certificatePath);

      try {
        // const certificate = await employeeModel.findOneAndUpdate(
        //   { email: email },
        //   {
        //     $set: {
        //       [certificateName.toLowerCase()]: pdfBuffer,
        //     },
        //   },
        //   { new: true }
        // );

        console.log(`Certificate stored in the database for ${email}`);
        resolve({ path: certificatePath, buffer: Buffer.concat(buffers) });
      } catch (error) {
        console.error(`Error storing certificate in the database: ${error.message}`);
        reject(error);
      }
    });

    writeStream.on("error", (error) => {
      console.error(`Error generating certificate: ${error.message}`);
      reject(error);
    });
  });
};

export default generateCertificate;
