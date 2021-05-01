/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
const {nanoid} = require('nanoid');
const books = require('./books');

const addNewBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount == readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id == id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari'+
            ' pageCount',
    });
    response.code(400);
    return response;
  }

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(509);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  if (name !== undefined) {
    const result = books
        .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    return {
      status: 'success',
      data: {
        result,
      },
    };
  }

  if (reading !== undefined) {
    console.log(typeof reading);
    if (reading === '0') {
      const result = books.filter((book) => book.reading === false);
      return {
        status: 'success',
        data: {
          result,
        },
      };
    }

    if (reading === '1') {
      const result = books.filter((book) => book.reading === true);
      return {
        status: 'success',
        data: {
          result,
        },
      };
    }

    if (reading !== '1' && reading !== '0') {
      return {
        status: 'success',
        data: {
          books,
        },
      };
    }
  }

  if (finished !== undefined) {
    if (finished === '0') {
      const result = books.filter((book) => book.finished === false);
      return {
        status: 'success',
        data: {
          result,
        },
      };
    }

    if (finished === '1') {
      const result = books.filter((book) => book.finished === true);
      return {
        status: 'success',
        data: {
          result,
        },
      };
    }

    if (finished !== '1' && finished !== '0') {
      return {
        status: 'success',
        data: {
          books,
        },
      };
    }
  }

  return {
    status: 'success',
    data: {
      books,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((b) => b.id == bookId);

  if (book[0] !== undefined) {
    return {
      status: 'success',
      data: book,
    };
  }

  const response = h.response({
    status: 'success',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id == bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari'+
            ' pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Berhasil memperbarui buku.',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const removeBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((book) => book.id == bookId);
  console.log(index);
  if (index !== -1) {
    books.splice(index);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addNewBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  removeBookByIdHandler,
};