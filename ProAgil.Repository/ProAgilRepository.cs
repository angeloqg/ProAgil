using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProAgilContext _context;

        public ProAgilRepository(ProAgilContext context)
        {
            this._context = context;

            // No Tracker (Geral)
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        // GERAL
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public void DeleteRange<T>(T[] entityArray) where T : class
        {
            _context.RemoveRange(entityArray);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        // EVENTO
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

                // Referência ManyToMany (Muitos para Muitos)
                if(includePalestrantes){
                    query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(p => p.Palestrante);
                }

                query = query.AsNoTracking()
                             .OrderBy(c => c.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes = false)
        {
             IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

                // Referência ManyToMany (Muitos para Muitos)
                if(includePalestrantes){
                    query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(p => p.Palestrante);
                }

                query = query.AsNoTracking()
                             .OrderByDescending(c => c.DataEvento)
                             .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrantes = false)
        {
             IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

                // Referência ManyToMany (Muitos para Muitos)
                if(includePalestrantes){
                    query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(p => p.Palestrante);
                }

                query = query.AsNoTracking()
                             .OrderByDescending(c => c.DataEvento)
                             .Where(c => c.Id == EventoId);

            return await query.FirstOrDefaultAsync();
        }

        // PALESTRANTE

        public async  Task<Palestrante> GetPalestranteAsyncById(int PalestranteId, bool includeEventos = false)
        {
             IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedesSociais);

                // Referência ManyToMany (Muitos para Muitos)
                if(includeEventos){
                    query = query
                        .Include(pe => pe.EventosPalestrantes)
                        .ThenInclude(e => e.Evento);
                }

                query = query.AsNoTracking()
                             .OrderBy(p => p.Nome)
                             .Where(p => p.Id == PalestranteId);

            return await query.FirstOrDefaultAsync();    
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string nome, bool includeEventos = false)
        {
             IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedesSociais);

                // Referência ManyToMany (Muitos para Muitos)
                if(includeEventos){
                    query = query
                        .Include(pe => pe.EventosPalestrantes)
                        .ThenInclude(e => e.Evento);
                }
                
                // No Tracker (específico)
                query = query.AsNoTracking()
                             .OrderBy(p => p.Nome)
                             .Where(p => p.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync(); 
        }
    }
}

// Tracker => o Entity Framework trava um objeto de banco quando este for usado, 
//            prós: proteção contra corrompimento de dados
//            contra: risco de travar uma aplicação

// No Tracker => Inibir a alteração de objetos de banco