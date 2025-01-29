import { INewPost, INewUser, IUpdatePost } from '@/types'
import {

    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
    useQueryErrorResetBoundary,

} from '@tanstack/react-query'
import { createNewUser, createPost, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'
import { Query } from 'appwrite'
import { string } from 'zod'

export const useCreateUserAccount = () =>{
    return useMutation(
        {
            mutationFn: (user: INewUser) => createNewUser(user)
        }
    )
}

export const useSignInAccount = () =>{
    return useMutation(
        {
            mutationFn: (user:
                {
                    email: string;
                    password: string;
                }
            ) => signInAccount(user)
        }
    )
}


export const useSignOutAccount = () =>{
    return useMutation(
        {
            mutationFn: signOutAccount
        }
    )
}

export const useCreatePost = () =>{
    const queryclient = useQueryClient();

    return useMutation({
        mutationFn: (post:INewPost) => createPost(post),
        onSuccess: () => {
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = ()=>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useLikePost = () =>{
    const queryclient=useQueryClient();


   return useMutation({
    mutationFn: ({postId,likesArray}:{ postId:string; likesArray: string[] }) =>likePost(postId,likesArray),
    onSuccess: (data)=>{
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
        })
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
        })
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
        })
    }
})
}

export const useSavePost = () =>{
    const queryclient=useQueryClient();


   return useMutation({
    mutationFn: ({postId,userId}:{ postId:string; userId: string }) =>savePost(postId,userId),
    onSuccess: ()=>{

        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
        })
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
        })
    }
})
}

export const useDeleteSavedPost = () =>{
    const queryclient=useQueryClient();


   return useMutation({
    mutationFn: (savedRecordId: string) =>deleteSavedPost(savedRecordId),
    onSuccess: ()=>{

        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
        })
        queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
        })
    }
})
}


export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}


export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID,postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId

    })
}

export const useUpdatePost = () => {
    const queryclient = useQueryClient();
    return useMutation({
        
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
        })

    })
}

export const useDeletePost = () => {
    const queryclient = useQueryClient();
    return useMutation({
        
        mutationFn: ({postId , imageId}: {postId:string; imageId:string}) => deletePost(postId,imageId),
        onSuccess: (data) => queryclient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })

    })
}

export const useGetPosts=() => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length===0)
            {
                return null;
            }
            const lastId=lastPage.documents[lastPage?.documents.length-1].$id;
            return lastId;  
        }
    })
}

export const useSearchPosts=(searchTerm: string)=>{
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS],
        queryFn: () => searchPosts(searchTerm),
        enabled:!!searchTerm
    })
}