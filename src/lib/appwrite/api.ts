import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appwriteconfig, avatars, databases, storage } from "./config";
import { createPortal } from "react-dom";
import { ImageDownIcon } from "lucide-react";


export async function createNewUser(user:INewUser) {

    try {

        const newAccount=await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
            
        )

        if(!newAccount) throw Error;

        const avatarUrl= avatars.getInitials(user.name);

         const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
         })

         return newUser;


        
    } catch (error) {
        console.log(error);
        return error;
    }
    
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: string;
    username?:string; 
}) {

        try {
            const newUser = await databases.createDocument(
                appwriteconfig.databaseId, 
                appwriteconfig.userCollectionId,
                ID.unique(),
                user,
            )
            return newUser;
            
        } catch (error) {
            console.log(error);
        }


}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {

    try {
         
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
        
    } catch (error) {
        console.log("error creating the session while sign in");
        console.log(error);
    }

}

export async function getCurrentUser() {
    try {
        
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;

        const currentuser = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentuser) throw Error;

        return currentuser.documents[0];
    
    } catch (error) {
        console.log(error);
    }
}


export async function signOutAccount() {
    try {
        const session= await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}


export async function createPost(post: INewPost) {

    try{
    
        //upload the image to file storage
        const uploadedFile=await uploadFile(post.file[0]);

        if(!uploadedFile) throw Error;

        const fileUrl=await getFilePreview(uploadedFile.$id);
        console.log(fileUrl)

        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        
        }

       const tags=post.tags?.replace(/ /g,' ').split(',') || [];
        

       //save post to database

       const newPost= await databases.createDocument(
        appwriteconfig.databaseId,
        appwriteconfig.postCollectionId,
        ID.unique(),
        {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl as string,
            imageid: uploadedFile?.$id,
            location: post.location,
            tags: tags,
        }
       );

       if(!newPost)
       {
        deleteFile(uploadedFile.$id);
        throw Error;
       }

       return newPost;
        
    } catch (error) {
        console.log(error);
    }

}

export async function uploadFile(file : File)
{
    try {
        const uploadedFile=await storage.createFile(
            appwriteconfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
        
    } catch (error) {
        console.log(error);
    }
}

export async function getFilePreview(fileId: string)
{
    try {
        const fileUrl= storage.getFilePreview(
            appwriteconfig.storageId,
            fileId,
            2000,
            2000,
            "top" as any,
            100
        );

        return fileUrl;
        
    } catch (error) {
        console.log(error);
    }
}

export async function  deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteconfig.storageId,fileId);

        return {status: 'ok'};
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts= await databases.listDocuments(
        appwriteconfig.databaseId,
        appwriteconfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    
    if(!posts) throw Error;

    return posts;
} 

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost=await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postCollectionId,
            postId,
            {
                likes:likesArray
            }
        );

        if(!updatedPost) throw Error;

        return updatedPost;
        
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost=await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        );

        if(!updatedPost) throw Error;

        return updatedPost;
        
    } catch (error) {
        console.log(error);
    }
}


export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode=await databases.deleteDocument(
            appwriteconfig.databaseId,
            appwriteconfig.savesCollectionId,
            savedRecordId
        );

       if(!statusCode) throw Error;
 

        return {status: 'ok'}
        
    } catch (error) {
        console.log(error);
    }
}