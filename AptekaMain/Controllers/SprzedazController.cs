using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AptekaMain.Models;
using Microsoft.AspNet.OData;

namespace AptekaMain.Controllers
{
    [EnableQuery]

    [Route("api/[controller]")]
    [ApiController]
    public class SprzedazController : ControllerBase
    {
        private readonly AptekaMainContext _context;

        public SprzedazController(AptekaMainContext context)
        {
            _context = context;
        }

        // GET: api/Sprzedazs
        [HttpGet]
        public IEnumerable<Sprzedaz> GetSprzedaz()
        {
            return _context.Sprzedaz;
        }

        // GET: api/Sprzedazs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSprzedaz([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sprzedaz = await _context.Sprzedaz.FindAsync(id);

            if (sprzedaz == null)
            {
                return NotFound();
            }

            return Ok(sprzedaz);
        }

        // PUT: api/Sprzedazs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSprzedaz([FromRoute] int id, [FromBody] Sprzedaz sprzedaz)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sprzedaz.IdSprzedaz)
            {
                return BadRequest();
            }

            _context.Entry(sprzedaz).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SprzedazExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Sprzedazs
        [HttpPost]
        public async Task<IActionResult> PostSprzedaz([FromBody] Sprzedaz sprzedaz)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Sprzedaz.Add(sprzedaz);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSprzedaz", new { id = sprzedaz.IdSprzedaz }, sprzedaz);
        }

        // DELETE: api/Sprzedazs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSprzedaz([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sprzedaz = await _context.Sprzedaz.FindAsync(id);
            if (sprzedaz == null)
            {
                return NotFound();
            }

            _context.Sprzedaz.Remove(sprzedaz);
            await _context.SaveChangesAsync();

            return Ok(sprzedaz);
        }

        private bool SprzedazExists(int id)
        {
            return _context.Sprzedaz.Any(e => e.IdSprzedaz == id);
        }
    }
}