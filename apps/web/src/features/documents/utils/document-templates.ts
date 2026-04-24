export type DocumentType = "Barangay Clearance" | "Certificate of Residency" | "Certificate of Indigency";

export interface DocumentTemplateData {
  name: string;
  address: string;
  age: number;
  purpose: string;
  issueDate: string;
  expiryDate?: string;
  documentNumber: string;
  barangayName: string;
  municipality: string;
  province: string;
  captainName: string;
}

export const DOCUMENT_TEMPLATES: Record<DocumentType, (data: DocumentTemplateData) => string> = {
  "Barangay Clearance": (data) => `
    This is to certify that ${data.name.toUpperCase()}, ${data.age} years of age, 
    a resident of ${data.address}, is known to be of good moral character and 
    a law-abiding citizen in this community.
    
    This certification is being issued upon the request of the above-named person 
    for the purpose of ${data.purpose.toUpperCase()}.
    
    Issued this ${new Date(data.issueDate).toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })} 
    at Barangay ${data.barangayName}, ${data.municipality}, ${data.province}.
  `,
  "Certificate of Residency": (data) => `
    TO WHOM IT MAY CONCERN:
    
    This is to certify that ${data.name.toUpperCase()}, of legal age, is a 
    BONAFIDE RESIDENT of Barangay ${data.barangayName}, ${data.municipality}, ${data.province}.
    
    Based on our records, the above-named person has been residing in this 
    barangay for several years and is known to be of good moral character.
    
    This certification is being issued upon the request of ${data.name.toUpperCase()} 
    for ${data.purpose.toUpperCase()} and for whatever legal purpose it may serve.
    
    Issued this ${new Date(data.issueDate).toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })}.
  `,
  "Certificate of Indigency": (data) => `
    TO WHOM IT MAY CONCERN:
    
    This is to certify that ${data.name.toUpperCase()}, ${data.age} years of age, 
    is a resident of ${data.address} and is one of the INDIGENT families in 
    this Barangay.
    
    This certification is being issued upon the request of the above-named person 
    for the purpose of ${data.purpose.toUpperCase()}.
    
    Issued this ${new Date(data.issueDate).toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })} 
    at the Office of the Barangay Chairman.
  `
};
