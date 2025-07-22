import { Division } from "./division.model";
import { Error } from "mongoose";
import { IDivision } from "./division.interface";

const createDivision = async (payload: IDivision) => {
  const isDivisionExist = await Division.findOne({ name: payload.name });
  if (isDivisionExist) {
    throw new Error("This division already exist");
  }

  const division = await Division.create(payload);
  return division;
};

const getAllDivision = async () => {
  const divisions = await Division.find();
  const divisionCount = await Division.countDocuments();
  return {
    data: divisions,
    meta: {
      total: divisionCount,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return {
    data: division,
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existDivision = await Division.findById(id);
  if (!existDivision) {
    throw new Error("Division not found");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new Error("A division name already exist");
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedDivision;
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};

export const divisionServices = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
