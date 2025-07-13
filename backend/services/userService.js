import prisma from "../prisma/index.js";

export const createUser = async (data) => {
    const newUser = await prisma.user.create({data});
    return newUser;
}

export const deleteUser = async (userId) => {
    await prisma.user.delete({
        where : {
            id : userId
        }
    });
}

export const updateUser = async (userId, data) => {
    await prisma.user.update({
        where : {
            id : userId
        }, data
    });
}