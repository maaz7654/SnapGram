import { INewPost, INewUser } from '@/types'
import {

    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,

} from '@tanstack/react-query'
import { createNewUser, createPost, getRecentPosts, signInAccount, signOutAccount } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'
import { Query } from 'appwrite'

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