import { Models } from 'appwrite';
import React from 'react'
import Loader from './Loader';
import GridPostsList from './GridPostsList';

type SearchResultProps={
    isSearchFetching: boolean;
    searchedPosts?: Models.Document[];
}

const SearchResults = ({isSearchFetching,searchedPosts}: SearchResultProps) => {

    if(isSearchFetching) return <Loader />

    if(searchedPosts && searchedPosts.length>0 ) {
        
        return (
        <GridPostsList posts={searchedPosts} />

    )

}


  return (
    <div className='text-light-4 mt-10 text-center w-full'>No results found</div>
  )
}

export default SearchResults