import QueryBuilder from '../../builder/QueryBuilder';
import { ILegalDocument } from './legalDocument.interface';
import { LegalDocument } from './legalDocument.module';

const createLegalDocument = async (payload: ILegalDocument) => {
    const isDocumentExist = await LegalDocument.find({slug:payload.slug})
    
    if(isDocumentExist.length > 0){
        throw new Error('Document with this slug already exists')
    }
    
    const result = await LegalDocument.create(payload);
    return result;
};

const getAllLegalDocuments = async (query: Record<string, any>) => {
  const result = new QueryBuilder(LegalDocument.find(), query)
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await result.modelQuery;
  const pagination = await result.getPaginationInfo();

  return {
    pagination,
    data,
  };
};

const getSingleLegalDocument = async (id: string) => {
  const result = await LegalDocument.findById(id);
  return result;
};

const updateLegalDocument = async (id: string, payload: Partial<ILegalDocument>) => {
  const result = await LegalDocument.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteLegalDocument = async (id: string) => {
  const result = await LegalDocument.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Legal document not found');
  }
  return result;
};
export const LegalDocumentService = {
  createLegalDocument,
  getAllLegalDocuments,
  getSingleLegalDocument,
  updateLegalDocument,
  deleteLegalDocument,
};
