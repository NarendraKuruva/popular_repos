import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {
   NOT_FOUND_PAGE_PATH,
   NOT_FOUND_PAGE
} from '../constants/NavigationConstants'
import PageNotFound404 from '../components/PageNotFound404'
import BlogsHome from '../../PopularBlogs/components/Home'
import BlogItemDetails from '../../PopularBlogs/components/BlogItemDetails'
import Contact from '../../PopularBlogs/components/Contact'
import About from '../../PopularBlogs/components/About'
import CounterWithToast from './CounterWithToast'
import Home from './Home'

export const routes = (): React.ReactElement => (
   <Router>
      <Switch>
         <Route exact path='/' component={Home} />
         <Route path='/counter' component={CounterWithToast} />
         <Route exact path='/blogs' component={BlogsHome} />
         <Route exact path='/about' component={About} />
         <Route exact path='/contact' component={Contact} />
         <Route exact path='/blog/:id' component={BlogItemDetails} />
         path={NOT_FOUND_PAGE_PATH}
         key={NOT_FOUND_PAGE}
         component={PageNotFound404}
      </Switch>
   </Router>
)
