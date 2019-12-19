using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AptekaMain.Models;

namespace AptekaMain.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PowiadomienieGlobalsController : ControllerBase
    {
        private readonly AptekaMainContext _context;

        public PowiadomienieGlobalsController(AptekaMainContext context)
        {
            _context = context;
        }

        // GET: api/PowiadomienieGlobals
        [HttpGet]
        public IEnumerable<PowiadomienieGlobalne> GetPowiadomienieGlobalne()
        {
            return _context.PowiadomienieGlobalne;
        }

        // GET: api/PowiadomienieGlobals/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPowiadomienieGlobalne([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var powiadomienieGlobalne = await _context.PowiadomienieGlobalne.FindAsync(id);

            if (powiadomienieGlobalne == null)
            {
                return NotFound();
            }

            return Ok(powiadomienieGlobalne);
        }

        // PUT: api/PowiadomienieGlobals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPowiadomienieGlobalne([FromRoute] int id, [FromBody] PowiadomienieGlobalne powiadomienieGlobalne)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != powiadomienieGlobalne.IdPowiadomienie)
            {
                return BadRequest();
            }

            _context.Entry(powiadomienieGlobalne).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PowiadomienieGlobalneExists(id))
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

        // POST: api/PowiadomienieGlobals
        [HttpPost]
        public async Task<IActionResult> PostPowiadomienieGlobalne([FromBody] PowiadomienieGlobalne powiadomienieGlobalne)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PowiadomienieGlobalne.Add(powiadomienieGlobalne);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPowiadomienieGlobalne", new { id = powiadomienieGlobalne.IdPowiadomienie }, powiadomienieGlobalne);
        }

        // DELETE: api/PowiadomienieGlobals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePowiadomienieGlobalne([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var powiadomienieGlobalne = await _context.PowiadomienieGlobalne.FindAsync(id);
            if (powiadomienieGlobalne == null)
            {
                return NotFound();
            }

            _context.PowiadomienieGlobalne.Remove(powiadomienieGlobalne);
            await _context.SaveChangesAsync();

            return Ok(powiadomienieGlobalne);
        }

        private bool PowiadomienieGlobalneExists(int id)
        {
            return _context.PowiadomienieGlobalne.Any(e => e.IdPowiadomienie == id);
        }
    }
}