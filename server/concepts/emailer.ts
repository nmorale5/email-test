import nodemailer from "nodemailer";

const EMAIL: string = "RestaurantReform@gmail.com";

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface RegisterEmailTemplate {
  toAddress: string;
  businessName: string;
  token: string;
}

export interface ThresholdEmailTemplate {
  toAddress: string;
  businessName: string;
  token: string;
  signers: number;
  petition: {
    title: string;
    problem: string;
    solution: string;
  };
}

export default class EmailerTool {
  private readonly transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: process.env.EMAIL_PWD,
    },
  });

  public async send(data: EmailData) {
    await this.transporter.sendMail({ from: EMAIL, ...data });
  }

  // for when a new business has been added to the database
  public async sendRegisterEmail(template: RegisterEmailTemplate) {
    const html = `<p>Hello ${template.businessName},</p>
      
    <p>You have been added as a restaurant on Restaurant Reform. This means someone has started a petition about you. To view the petition and all its signers, please register a user account and link it to your business using the following verification token:</p>
    
    <p>${template.token}</p>
    
    <p>Best,<br/>
    Restaurant Reform</p>`;

    const data: EmailData = {
      to: template.toAddress,
      subject: `Register For Restaurant Reform`,
      html: html,
    };
    return await this.send(data);
  }

  // for when a petition has reached its threshold
  public async sendThresholdEmail(template: ThresholdEmailTemplate) {
    const html = `<p>Hello ${template.businessName},</p>
      
    <p>${template.signers} people are petitioning the following message:</p>

    <h2>${template.petition.title}</h2>

    <p><strong>Problem:</strong> ${template.petition.problem}<p>

    <p><strong>Proposed Solution</strong>: ${template.petition.solution}<p>
    
    <p>If you haven't already, please register a user account and link it to your business using the following verification token:
    
    <p>${template.token}</p> 
    
    <p>This will allow you to respond to the petition.</p>
    
    <p>Best,<br/>
    Restaurant Reform</p>`;

    const data: EmailData = {
      to: template.toAddress,
      subject: `A Petition on Restaurant Reform Has Reached ${template.signers} Signers`,
      html: html,
    };
    await this.send(data);
  }
}
