const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { z } = require("zod");

module.exports = class NotesController {
  async create(request, response) {
    const createNoteBodySchema = z.object({
      title: z.string().max(50),
      content: z.string().max(150),
      authorName: z.string().max(50),
    });

    const { success, data, error } = createNoteBodySchema.safeParse(
      request.body
    );

    if (!success) {
      throw new AppError(`${error}`);
    }

    await knex("notes").insert({
      title: data.title,
      content: data.content,
      authorName: data.authorName,
    });

    return response.status(201).json({});
  }

  async index(request, response) {
    let { limit, offset } = request.query;

    // O limit define o número máximo de registros retornados em uma consulta,
    // enquanto o offset determina a posição inicial a partir da qual os registros são recuperados.
    // Converte limit e offset para números, caso sejam strings.
    limit = Number(limit);
    offset = Number(offset);

    // Define um valor padrão de 5 para limit, caso não seja especificado.
    if (!limit) {
      limit = 5;
    }

    // Define um valor padrão de 0 para offset, caso não seja especificado ou seja negativo.
    if (!offset || offset < 0) {
      offset = 0; //skip
    }

    // Seleciona as notas com base no offset e limit especificados diretamente do banco.
    const notes = await knex("notes").select("*").offset(offset).limit(limit);

    // Obtém a contagem total de notas.
    const notesAmount = (await knex("notes").count("* as totalCount").first())
      .totalCount;

    const next = offset + limit; // Calcula o offset da próxima página.
    const currURL = request.baseUrl;

    // Cria o URL da próxima página se houver mais notas disponíveis.
    const nextURL =
      next < notesAmount ? `${currURL}?limit=${limit}&offset=${next}` : null;

    // Calcula o offset da página anterior.
    const previous = offset - limit < 0 ? null : offset - limit;

    // Cria o URL da página anterior, se aplicável.
    const previousURL =
      previous != null ? `${currURL}?limit=${limit}&offset=${previous}` : null;

    // Retorna os dados da paginação junto com as notas selecionadas.
    return response.send({
      nextURL,
      previousURL,
      limit,
      offset,
      notesAmount,
      results: notes.sort((a, b) => b.id - a.id), // Ordena as notas por ID em ordem decrescente para retornar a mais recente.
    });
  }
};
