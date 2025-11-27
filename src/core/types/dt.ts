export interface ApplicationRecord {
  id: number;
  ApprovalStatus: string | null;
  Number_Continuing: number;
  Number_New: number;
  GEC_New: number;
  GEC_Continuing: number;
  GAC_New: number;
  GAC_Continuing: number;
  GC_New: number;
  GC_Continuing: number;
  Female: number;
  Youth: number;
  Province: string;
}

export interface bio {
  idNumber: string;
  disabled: string;
  gender: string;
  province: string;
  nationality: string;
  race: string;
}

export const data: bio[] = [{ "idNumber": "9001011234081", "gender": "Female", "disabled": "No", "race": "Black", "nationality": "South African", "province": "Gauteng" }, { "idNumber": "8507155780032", "gender": "Male", "disabled": "No", "race": "Coloured", "nationality": "South African", "province": "Western Cape" }, { "idNumber": "9902300456789", "gender": "Female", "disabled": "Yes", "race": "Black", "nationality": "South African", "province": "KwaZulu-Natal" }, { "idNumber": "7705129999123", "gender": "Male", "disabled": "No", "race": "Indian", "nationality": "South African", "province": "Gauteng" }, { "idNumber": "0304052345016", "gender": "Female", "disabled": "No", "race": "Black", "nationality": "South African", "province": "Limpopo" }, { "idNumber": "6508277654320", "gender": "Male", "disabled": "Yes", "race": "White", "nationality": "South African", "province": "Free State" }, { "idNumber": "8209130004128", "gender": "Female", "disabled": "No", "race": "Coloured", "nationality": "South African", "province": "Northern Cape" }, { "idNumber": "9106245432115", "gender": "Male", "disabled": "No", "race": "Black", "nationality": "Zimbabwean", "province": "Mpumalanga" }, { "idNumber": "0401011000009", "gender": "Female", "disabled": "Yes", "race": "Indian", "nationality": "South African", "province": "KwaZulu-Natal" }, { "idNumber": "8803308123454", "gender": "Male", "disabled": "No", "race": "Black", "nationality": "South African", "province": "North West" }, { "idNumber": "7602292999007", "gender": "Male", "disabled": "No", "race": "Coloured", "nationality": "South African", "province": "Western Cape" }, { "idNumber": "0202020234005", "gender": "Female", "disabled": "No", "race": "Black", "nationality": "Mozambican", "province": "Gauteng" }, { "idNumber": "9308086789002", "gender": "Male", "disabled": "Yes", "race": "White", "nationality": "South African", "province": "Eastern Cape" }, { "idNumber": "0012310000124", "gender": "Female", "disabled": "No", "race": "Other", "nationality": "South African", "province": "Limpopo" }, { "idNumber": "8701015999018", "gender": "Male", "disabled": "No", "race": "Black", "nationality": "South African", "province": "Gauteng" }]

export const dgData: ApplicationRecord[] = [
  {
    "id": 2042,
    "ApprovalStatus": "Rejected",
    "Number_Continuing": 0,
    "Number_New": 6,
    "GEC_New": 6,
    "GEC_Continuing": 0,
    "GAC_New": 6,
    "GAC_Continuing": 0,
    "GC_New": 6,
    "GC_Continuing": 0,
    "Female": 5,
    "Youth": 6,
    "Province": "Gauteng"
  },
  {
    "id": 2043,
    "ApprovalStatus": "Rejected",
    "Number_Continuing": 0,
    "Number_New": 5,
    "GEC_New": 2,
    "GEC_Continuing": 0,
    "GAC_New": 2,
    "GAC_Continuing": 0,
    "GC_New": 2,
    "GC_Continuing": 0,
    "Female": 1,
    "Youth": 2,
    "Province": "Mpumalanga"
  },
  {
    "id": 2044,
    "ApprovalStatus": "Approved",
    "Number_Continuing": 0,
    "Number_New": 5,
    "GEC_New": 5,
    "GEC_Continuing": 0,
    "GAC_New": 5,
    "GAC_Continuing": 0,
    "GC_New": 5,
    "GC_Continuing": 0,
    "Female": 4,
    "Youth": 5,
    "Province": "Gauteng"
  },
  {
    "id": 2045,
    "ApprovalStatus": "Rejected",
    "Number_Continuing": 0,
    "Number_New": 5,
    "GEC_New": 5,
    "GEC_Continuing": 0,
    "GAC_New": 5,
    "GAC_Continuing": 0,
    "GC_New": 5,
    "GC_Continuing": 0,
    "Female": 3,
    "Youth": 5,
    "Province": "Gauteng"
  },
  {
    "id": 2046,
    "ApprovalStatus": "Rejected",
    "Number_Continuing": 0,
    "Number_New": 1,
    "GEC_New": 1,
    "GEC_Continuing": 0,
    "GAC_New": 1,
    "GAC_Continuing": 0,
    "GC_New": 1,
    "GC_Continuing": 0,
    "Female": 0,
    "Youth": 1,
    "Province": "Gauteng"
  },
  {
    "id": 2047,
    "ApprovalStatus": "Rejected",
    "Number_Continuing": 0,
    "Number_New": 5,
    "GEC_New": 0,
    "GEC_Continuing": 2,
    "GAC_New": 0,
    "GAC_Continuing": 2,
    "GC_New": 0,
    "GC_Continuing": 2,
    "Female": 0,
    "Youth": 5,
    "Province": "Mpumalanga"
  },
  {
    "id": 2048,
    "ApprovalStatus": "Approved",
    "Number_Continuing": 5,
    "Number_New": 0,
    "GEC_New": 0,
    "GEC_Continuing": 5,
    "GAC_New": 0,
    "GAC_Continuing": 5,
    "GC_New": 0,
    "GC_Continuing": 5,
    "Female": 3,
    "Youth": 5,
    "Province": "Gauteng"
  },
  {
    "id": 2050,
    "ApprovalStatus": "Approved",
    "Number_Continuing": 10,
    "Number_New": 0,
    "GEC_New": 0,
    "GEC_Continuing": 10,
    "GAC_New": 0,
    "GAC_Continuing": 10,
    "GC_New": 0,
    "GC_Continuing": 10,
    "Female": 8,
    "Youth": 10,
    "Province": "Gauteng"
  },
  {
    "id": 2051,
    "ApprovalStatus": "Approved",
    "Number_Continuing": 10,
    "Number_New": 0,
    "GEC_New": 0,
    "GEC_Continuing": 10,
    "GAC_New": 0,
    "GAC_Continuing": 10,
    "GC_New": 0,
    "GC_Continuing": 10,
    "Female": 8,
    "Youth": 10,
    "Province": "Gauteng"
  },
  {
    "id": 2052,
    "ApprovalStatus": "Approved",
    "Number_Continuing": 5,
    "Number_New": 0,
    "GEC_New": 0,
    "GEC_Continuing": 5,
    "GAC_New": 0,
    "GAC_Continuing": 5,
    "GC_New": 0,
    "GC_Continuing": 5,
    "Female": 3,
    "Youth": 5,
    "Province": "Gauteng"
  }
]
