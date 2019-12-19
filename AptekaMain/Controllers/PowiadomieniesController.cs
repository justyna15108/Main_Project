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
    public class PowiadomieniesController : ControllerBase
    {
        private readonly AptekaMainContext _context;

        public PowiadomieniesController(AptekaMainContext context)
        {
            _context = context;
        }

        // GET: api/Powiadomienies
        [HttpGet]
        public IEnumerable<Powiadomienie> GetPowiadomienie()
        {
            return _context.Powiadomienie;
        }

        // GET: api/Powiadomienies/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPowiadomienie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var powiadomienie = await _context.Powiadomienie.FindAsync(id);

            if (powiadomienie == null)
            {
                return NotFound();
            }

            return Ok(powiadomienie);
        }

        // PUT: api/Powiadomienies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPowiadomienie([FromRoute] int id, [FromBody] Powiadomienie powiadomienie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != powiadomienie.IdPowiadomienie)
            {
                return BadRequest();
            }

            _context.Entry(powiadomienie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PowiadomienieExists(id))
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

        // POST: api/Powiadomienies
        [HttpPost]
        public async Task<IActionResult> PostPowiadomienie([FromBody] Powiadomienie powiadomienie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Powiadomienie.Add(powiadomienie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPowiadomienie", new { id = powiadomienie.IdPowiadomienie }, powiadomienie);
        }

        // DELETE: api/Powiadomienies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePowiadomienie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var powiadomienie = await _context.Powiadomienie.FindAsync(id);
            if (powiadomienie == null)
            {
                return NotFound();
            }

            _context.Powiadomienie.Remove(powiadomienie);
            await _context.SaveChangesAsync();

            return Ok(powiadomienie);
        }

        private bool PowiadomienieExists(int id)
        {
            return _context.Powiadomienie.Any(e => e.IdPowiadomienie == id);
        }
    }
}