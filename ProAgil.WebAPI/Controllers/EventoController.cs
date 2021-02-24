using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{
    [Route("/api/[controller]")]
    [ApiController] // **Nota: (Olhar final da classe)
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsync(true);
                var results = _mapper.Map<IEnumerable<EventoDto>>(eventos);

                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou: {ex.Message}");
            }
        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, true);
                var results = _mapper.Map<EventoDto>(evento);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou: {ex.Message}");
            }
        }

        [HttpGet("GetByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsyncByTema(tema, true);
                var results = _mapper.Map<IEnumerable<EventoDto>>(eventos);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _repo.Add(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(model));
                }

            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou: {ex.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if (evento == null) return NotFound();

                var idLotes = new List<int>();
                var idRedesSociais = new List<int>();

                model.Lotes.ForEach(item => idLotes.Add(item.Id));
                model.RedesSociais.ForEach(item => idRedesSociais.Add(item.Id));
         
                var lotes = evento.Lotes.Where(lote => !idLotes.Contains(lote.Id)).ToArray();
                var redesSociais = evento.RedesSociais.Where(rede => !idRedesSociais.Contains(rede.Id)).ToArray();

                if (lotes.Count() > 0) _repo.DeleteRange(lotes);

                if (redesSociais.Count() > 0) _repo.DeleteRange(redesSociais);


                _mapper.Map(model,evento);

                _repo.Update(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(model));
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, false);

                if (evento == null) return NotFound();

                _repo.Delete(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Ok();
                }

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

            return BadRequest();
        }

        // GET api/values
        [HttpPost("Upload")]
        public IActionResult Upload()
        {
            try
            {
                // Obtem o arquivo a partir da primeira posição do arquivo
                var file = Request.Form.Files[0];

                // Obtem o nome da pasta a partir da combinação do path e da pasta
                var folderName = Path.Combine("Resources", "Images");

                // Obtem o diretório aonde os arquivos serão salvos
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                // Verifica se o arquivo existe
                if (file.Length > 0)
                {

                    // Obtem o nome do arquivo
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;

                    // Obtem o caminho completo aonde o arquivo será salvo
                    var fullPath = Path.Combine(pathToSave, fileName.Replace("\"", " ").Trim());

                    // Copia o arquivo para stream
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Erro ao tentar realizar upload!");
            }
        }
    }
}

/* **Nota: Observar o uso da annotation '[ApiController]', esse recurso está presente na versão mais atual
 *         da Net.Core, ele evita ter que decorrar a passagem de parametros nos métodos com
 *         [FromBody], no caso de POST e [FromHeader], no caso de GET, além de não haver a necessidade 
 *         de ter que validar o Model com 'ModelState.IsValid', para validar se o Model está correto,
 *         a exemplo, se estiver usando decorrator no Model, validar as informações enviadas*/