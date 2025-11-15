describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:5173/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:5173/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name="username"]').type('mluukkai')
      cy.get('input[name="password"]').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input[name="username"]').type('mluukkai')
      cy.get('input[name="password"]').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('input[name="title"]').type('My first blog')
      cy.get('input[name="author"]').type('Matti')
      cy.get('input[name="url"]').type('http://example.com')
      cy.contains('save').click()
      cy.contains('My first blog')
    })

    it('User can like a blog', function () {
      cy.contains('My first blog').parent().contains('view').click()
      cy.contains('My first blog').parent().contains('like').click()
      cy.contains('My first blog').parent().should('contain', 'likes 1')
    })

    it('Creator can delete a blog', function () {
      cy.contains('My first blog').parent().contains('view').click()
      cy.contains('My first blog').parent().contains('remove').click()
      cy.get('html').should('not.contain', 'My first blog')
    })

    it('Only creator sees delete button', function () {
      cy.request('POST', 'http://localhost:5173/api/users', {
        name: 'Other',
        username: 'other',
        password: '1234'
      })
      cy.login({ username: 'other', password: '1234' })
      cy.contains('My first blog').parent().contains('view').click()
      cy.contains('My first blog').parent().should('not.contain', 'remove')
    })
  })

  describe('Blogs ordering', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({ title: 'Blog 1', author: 'A', url: 'url1', likes: 2 })
      cy.createBlog({ title: 'Blog 2', author: 'B', url: 'url2', likes: 5 })
      cy.createBlog({ title: 'Blog 3', author: 'C', url: 'url3', likes: 3 })
    })

    it('Blogs are sorted by likes', function () {
      cy.get('.blog').eq(0).should('contain', 'Blog 2')
      cy.get('.blog').eq(1).should('contain', 'Blog 3')
      cy.get('.blog').eq(2).should('contain', 'Blog 1') 
    })
  })
})
