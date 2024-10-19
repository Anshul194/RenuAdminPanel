import fs from "fs";
import PDFDocument from "pdfkit";

const COMPANY_ADDRESS =
  "Renu Sharma Foundation, VPO Baspadmka, Teh Pataudi, Dist Gurugram (HR), Pin 122503";

const getCertificateContent = (name, post, startDate, endDate, tenure) => {
  return {
    subject: `Joining Offer: ${post} at Renu Sharma Healthcare Education & Foundation`,
    mainContent: `
      We are delighted to offer you the position of ${post} intern at Renu Sharma Healthcare Education & Foundation.
      Your exceptional skills and experience make you an ideal fit for our team.
      We believe your contributions will significantly impact our organization's growth.
    `,
    closingContent: `
      To confirm your acceptance, please sign and return this letter within three days.
      For queries, contact us at 9671457366 or Neha.rshefoundation@gmail.com.
    `,
    finalMessage:
      "We eagerly await your positive response and look forward to having you on board.",
    congratsMessage: "Warmest congratulations on this exciting opportunity!",
    folderPath: "offerletter",
    startDate: startDate ? `Commencement Date: ${startDate}` : "",
    endDate: endDate ? `Completion Date: ${endDate}` : "",
    tenure: tenure ? `Duration: ${tenure}` : "",
  };
};

const generateCertificate = async (
  name,
  email,
  post,
  startDate,
  endDate,
  tenure
) => {
  console.log(name, email, post, startDate, endDate, tenure);
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
    });

    const buffers = [];
    const template = getCertificateContent(
      name,
      post,
      startDate,
      endDate,
      tenure
    );
    const certificatePath = `${template.folderPath}/${name}_certificate.pdf`;
    const writeStream = fs.createWriteStream(certificatePath);

    doc.on("data", buffers.push.bind(buffers));
    doc.pipe(writeStream);

    const backgroundImagePath = "images/logo-image.png";
    const backgroundImage = fs.readFileSync(backgroundImagePath);

    doc.image(backgroundImage, 0, 60, {
      width: doc.page.width + 2,
      height: doc.page.height - 210,
      opacity: 0.8,
    });

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("green")
      .text("Renu Sharma Healthcare Education & Foundation", {
        align: "center",
      });
    doc.moveDown();

    doc
      .font("Helvetica")
      .fontSize(14)
      .fillColor("black")
      .text(`Address: ${COMPANY_ADDRESS}`, { align: "center" })
      .moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text(template.startDate, { align: "center" })
      .text(template.endDate, { align: "center" })
      .text(template.tenure, { align: "center" })
      .moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" })
      .moveDown();

    doc
      .fontSize(18)
      .fillColor("blue")
      .text(template.subject, { align: "center" });
    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Dear ${name},`, { align: "left" })
      .moveDown();

    doc.text(template.mainContent, { align: "left", width: 500 });
    doc.moveDown();

    doc.text(template.closingContent, { align: "left" });
    doc
      .font("Helvetica-Bold")
      .text("9671457366", { continued: true })
      .font("Helvetica")
      .text(" or ", { continued: true })
      .font("Helvetica-Bold")
      .text("Neha.rshefoundation@gmail.com");
    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text(template.finalMessage, { align: "left" })
      .moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text(template.congratsMessage, { align: "left" })
      .moveDown();

    doc.text(`Name - ${name}`, { align: "left" });

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
        console.log(`Certificate stored in the database for ${email}`);
        resolve({ path: certificatePath, buffer: Buffer.concat(buffers) });
      } catch (error) {
        console.error(
          `Error storing certificate in the database: ${error.message}`
        );
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
