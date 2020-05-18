import React from 'react'
import { useQuery } from '@apollo/client';

import { fetchPosts } from '../../queries/fetchPosts'
import CardPost from '../presentational/CardPost';
import '../../styles/home.css'

export default function Home(props) {
  const { loading, error, data } = useQuery(fetchPosts);
  if (loading) return <h4>Loading...</h4>
  if (error) return <h4>{error}</h4>

  return (
    <div className="home container" >
      {data.getPosts.map(post => <CardPost key={post.id} post={post} />)}
    </div >
  )
}
